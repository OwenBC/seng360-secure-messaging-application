import asyncio
from math import fabs
import websockets,rsa,sys,random,re,time,random,threading
local_message_box={}
message_ids=[]
exiting = False


message_queue_mutex = threading.Lock()

message_queue = []
current_reuest = ''
current_reuest_mutex = threading.Lock()

def new_id(id_list):
    n_id = random.randint(0,9999999)
    while str(n_id) in id_list:
        n_id = random.randint(0,9999999)
    return n_id

# def keep_alive(websocket):
#     if not message_queue_mutex.locked():
#         pass

def to_binary(path):
    p = open(path,'rb')
    data = p.read()
    title = hash(data)
    t= path[path.rfind('.')+1:]
    return bytes(f'{title}-{data}-{t}')

def print_local_message():
    global local_message_box
    for k in local_message_box.keys():
        for j in local_message_box[k]:
            print(f'{k}:',j)
            sys.stdout.flush()

def add_request(user_name):
    # user_name=user_name[0]
    global local_message_box
    global message_ids
    global current_reuest
    global exiting
    while True:
        user_cmd = input("Sending/deleting/deletingAccount/image/exit(Enter:s/d/da/i/e):").upper() # user command
        if user_cmd == 'S': # sending message
            target_user = input('Who you want to talk:')
            message = input('What you what to say:')
            
            flag='s'
            curr_time = time.ctime(time.time())
            tmp_has= f'{user_name}_{target_user} {message},{curr_time}'
            message_id = hash(tmp_has)
            message_ids.append(message_id)
            if f'{user_name}_{target_user}' in local_message_box.keys():
                
                local_message_box[f'{user_name}_{target_user}'].append([f'{user_name}_{target_user}',message_id,message,curr_time])
            else:
                local_message_box[f'{user_name}_{target_user}'] = [[f'{user_name}_{target_user}',message_id,message,curr_time]]

        elif user_cmd == 'D': # deleting message
            flag='d'
            target_user = 'None'
            message = 'None'
            message_id = input('Enter message id:')

            for k in local_message_box.keys():
                for m in local_message_box[k]:
                    if m[0] == message:
                        local_message_box[k].remove(m)
            curr_time = time.ctime(time.time())

        elif user_cmd == 'I':
            flag='s'
            target_user = input('Who you want to send:')
            message = input('image path:').replace('\\','\\\\')
            curr_time = time.ctime(time.time())
            try:
                pack = to_binary(message)
            except:
                print('decode failed')
                continue
            tmp_has= f'{user_name}_{target_user} {pack},{curr_time}'
            message_id = hash(tmp_has)
            message_ids.append(message_id)

            if f'{user_name}_{target_user}' in local_message_box.keys():
                
                local_message_box[f'{user_name}_{target_user}'].append([f'{user_name}_{target_user}',message_id,pack,curr_time])
            else:
                local_message_box[f'{user_name}_{target_user}'] = [[f'{user_name}_{target_user}',message_id,pack,curr_time]]


        elif user_cmd == 'DA':
            flag='da'
            target_user = 'None'
            message = 'None'
            message_id = 'None'
            curr_time = time.ctime(time.time())
            exiting = True

        elif user_cmd == 'E':
            flag = 'e'
            target_user=''
            exiting = True
        else:
            continue
        
        current_reuest_mutex.acquire()
        current_reuest = f'[{flag}]:[{user_name}_{target_user}]:[{message_id}]:[{message}]:[{curr_time}]'
        current_reuest_mutex.release()

        if flag == 'e':
            break
        



# async def recv_data(websocket,c_prikey):
#     while True:
#         pass



async def main():
    global current_reuest
    global local_message_box
    global message_ids
    global exiting
    # Generate the client public key and private key
    (c_pubkey,c_prikey)=rsa.newkeys(1024)

    uri = "ws://localhost:9999"
    async with websockets.connect(uri) as websocket:
        user_name='unknown'

        pak = await websocket.recv()
        s_pubkey = rsa.PublicKey.load_pkcs1(pak.encode("utf-8"))
        await websocket.send(c_pubkey.save_pkcs1('PEM').decode("utf-8")) # send client public key
       
        authorization_nonce = random.randint(0,4096) # Generate nonce for authorization
        cipher_authorization_nonce = rsa.encrypt(str(authorization_nonce).encode(),s_pubkey) # encrypt the nonce
        
        await websocket.send(cipher_authorization_nonce) # send cipher nonce and client public key
        nonce_back =int(rsa.decrypt(await websocket.recv() ,c_prikey)) # get the nonce back
        
        if authorization_nonce+1 == nonce_back: #confirm the server response

            state = "unauthorized"
            while True:
                if state=='unauthorized': # Confirm cmd
                    user_cmd = input("login/signup/exit(Enter:l/s/e):")

                    if user_cmd=='l' or user_cmd == 'L': 
                        user_name = input('Enter your username:')
                        password = input('Enter your password:')
                        request=f'[login]:[{user_name}]:[{password}]'

                    elif user_cmd=='s' or user_cmd == 'S':
                        user_name = input('Enter your username:')
                        password = input('Enter your password:')
                        request=f'[signup]:[{user_name}]:[{password}]'
                        
                    elif user_cmd=='e' or user_cmd == 'E':
                        request=f'[exit]:[]:[]'
                    else:
                        continue
                    
                    '''encrypt the request which include request flag, username and user password '''
                    chipher_request = rsa.encrypt(request.encode(),s_pubkey)
                    await websocket.send(chipher_request)

                ''' get the response from the server'''
                try:
                    ''' load the cipher response and new public key'''
                    pak = await websocket.recv()
                    tmp_new_pubkey = rsa.PublicKey.load_pkcs1(pak.encode("utf-8"))
                    recv_response = rsa.decrypt(await websocket.recv(),c_prikey).decode()

                    fmt=re.compile(r'^\[(.*)\]:\[(.*)\]')
                    msg=fmt.match(recv_response).groups()
                    flag = msg[0]
                    response = msg[1]

                except:
                    print('Server Time out!')
                    return 0
                
                if flag == 'authorized': # update the server public key to the newest and then read for the next step
                    s_pubkey=tmp_new_pubkey
                    break

                elif flag == 'unauthorized':# print the response
                    
                    if response == 'Wrong password!':
                        print('Wrong Password')
                        sys.stdout.flush()
                    elif response == 'User Not Exist!':
                        print('User Not Exist!')
                    elif response == 'User Exist!':
                        print('User Exist!')

                elif flag == 'exit': #exit the client
                    try:
                        exit(0)
                    except:
                        pass
                    break                
            print('ready')
            
            

            # recv the history
            while True:
                recv_data = (rsa.decrypt(await websocket.recv(),c_prikey)).decode()
                # print(recv_request)
                fmt=re.compile(r'^\[(.*)\]:\[(.*)\]:\[(.*)\]:\[(.*)\]:\[(.*)\]')
                msg=fmt.match(recv_data).groups()
                flag = msg[0]
                sender_receiver = msg[1]
                message_id = msg[2]
                message = msg[3]
                date = msg[4]

                message_ids.append(message_id)

                if flag  == 'end':
                    break

                if sender_receiver in local_message_box.keys():
                    local_message_box[sender_receiver].append([sender_receiver,message_id,message,date])
                else:
                    local_message_box[sender_receiver] = [[sender_receiver,message_id,message,date]]

            print('history received:')
            print_local_message()


            

            # print(local_message_box)

            thread_add_request = threading.Thread(target=add_request,args=(user_name,))
            thread_add_request.start()

            # thread_recv_data = threading.Thread(target=recv_data,args=(websocket,c_prikey))
            # thread_recv_data.start()


            
            # ready for server
            while True:
                # time.sleep(3)
            
                if current_reuest == '':
                    pak_message = f'[c]:[{user_name}_None]:[None]:[None]:[None]'
                    new_message_cihper = rsa.encrypt(pak_message.encode(),s_pubkey)
                    await websocket.send(new_message_cihper)
                else:
                    # print('send new message')
                    new_message_cihper = rsa.encrypt(current_reuest.encode(),s_pubkey)
                    await websocket.send(new_message_cihper)

                    current_reuest_mutex.acquire()
                    current_reuest = ''
                    current_reuest_mutex.release()
                    if exiting:
                        print('exit the program')
                        exit(0)
                
                # start recv message from the server
                while True:
                    recv_request = (rsa.decrypt(await websocket.recv(),c_prikey)).decode()
                    # print('recv_request',recv_request)

                    fmt=re.compile(r'^\[(.*)\]:\[(.*)\]:\[(.*)\]:\[(.*)\]:\[(.*)\]')
                    msg=fmt.match(recv_request).groups()
                    flag = msg[0]
                    sender_receiver = msg[1]
                    message_id = msg[2]
                    message = msg[3]
                    date = msg[4]

                    # print(sender_receiver,message_id,message,date)
                    # sys.stdout.flush()


                    if flag  == 'end':
                        break
                    if flag == 'continue':
                        # print('continue')
                        # sys.stdout.flush() 
                        # break
                        continue
                        # pass
                    # put the message into local client
                    if message_id == 'None':
                        print('User not exit!')
                        print_local_message() 
                        continue
                    if sender_receiver in local_message_box.keys():
                        local_message_box[sender_receiver].append([sender_receiver,message_id,message,date])
                        print_local_message() 
                    else:
                        local_message_box[sender_receiver] = [[sender_receiver,message_id,message,date]]
                        print_local_message()

        

if __name__ == '__main__':
    asyncio.run(main())
    
