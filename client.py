from os import close
import socket,re


def client_process(s,pbkey): # temp
    print('public key is',pbkey)
    while True:
        data=input('Enter: message:')
        if data == '':
            continue
        s.send(data.encode())
        if data == 'e':
            s.close()
            print('close connection')
            exit(0)
        recv = s.recv(1024).decode()
        print(recv)

def main():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect(("127.0.0.1", 6000))
    print(s.recv(1024).decode())


    state = "unauthorized" # the intial state is unauthorized
    while True:
        # sending data to the server, data format:[flag]:[username]:[password]
        if state=='unauthorized': # 
            user_cmd = input("login/signup/exit(Enter:l/s/e):")

            if user_cmd=='l' or user_cmd == 'L': 
                user_name = input('Enter your username:')
                password = input('Enter your password:')
                data=f'[login]:[{user_name}]:[{password}]:[client\'s public key]:[nonce]'
                s.send(data.encode())
                # print(s.recv(1024).decode())

            elif user_cmd=='s' or user_cmd == 'S':
                user_name = input('Enter your username:')
                password = input('Enter your password:')
                data=f'[signup]:[{user_name}]:[{password}]:[client\'s public key]:[nonce]'
                s.send(data.encode())
                # print(s.recv(1024).decode())
                
            elif user_cmd=='e' or user_cmd == 'E':
                data=f'[exit]:[]:[]:[]'
                s.send(data.encode())
            else:
                continue


        # recv data from server
        try:
            recvdat = s.recv(1024).decode()
            # print(recvdat)
        except:
            print('Server Time out!')
            break

        fmt=re.compile(r'^\[(.*)\]:\[(.*)\]')
        msg=fmt.match(recvdat).groups()
        # print(msg)

        '''
        if nonce != nonce before
        then break
        print unsafe connection
        '''
         

        flag = msg[0]
        server_response = msg[1]

        if flag == 'authorized':
            pbkey=server_response
            client_process(s,pbkey)
            break
        elif flag =='unauthorized':
            if server_response == 'Wrong password!':
                print('wrong password')
            elif server_response == 'User Exist!':
                print('User Exist!')


        elif flag == 'exit':
            try:
                s.close()
            except:
                pass
            break
    

    s.close()

if __name__ == '__main__':
    
    main()