#!/usr/bin/env python

# WS server example

import asyncio,sys
from math import fabs
import websockets
import rsa,pickle,random,re,time
import sqlite3
from database_functions import *

async def server_run(websocket, path):

    global pubkey
    global prikey
    global valid_user
    global current_online
    global chatting_relations
    global send_message_queue

    curr_prikey = prikey


    '''-------------------------------------------------------'''
    '''
    get the user account info from the SQL
    '''
    # Uncomment lines below to add these to the user database
    #add_user('tom', 111)
    #add_user('bob', 222)

    '''-------------------------------------------------------'''
    
    
    
    await websocket.send(pubkey.save_pkcs1('PEM').decode("utf-8")) # send the server public key

    client_public_key_received = await websocket.recv() # client public key
    client_public_key = rsa.PublicKey.load_pkcs1(client_public_key_received.encode('utf_8'), "PEM")

    response_authorization_nonce_received = await websocket.recv()    
    response_authorization_nonce_back = int(rsa.decrypt(response_authorization_nonce_received, prikey)) +1

    cipher_authorization_pck = rsa.encrypt(str(response_authorization_nonce_back).encode(), client_public_key)
    
    await websocket.send(cipher_authorization_pck)
    

    max_login_attempts = 5 # prevent brute force attack, limited the attempts
    curr_login_attempts = 0
    is_authorization_complete = False

    (new_pubkey,new_prikey)=rsa.newkeys(1024) # Generate the new public key and private key for individual client comminication

    while True:
        if is_authorization_complete: # the authorization is completed, then break the loop
            break 
        if curr_login_attempts >= max_login_attempts:
            print('Server Time out!')
            sys.stdout.flush()
            return 0

        '''The received data and decrypted, and extract the user info from the data'''    
        recv_request = (rsa.decrypt(await websocket.recv(),curr_prikey)).decode()
        curr_login_attempts+=1

        fmt=re.compile(r'^\[(.*)\]:\[(.*)\]:\[(.*)\]')
        msg=fmt.match(recv_request).groups()

        flag = msg[0]
        username = msg[1]
        password = msg[2]

        if flag=='login': # handling the login request

            if (check_username(username) == True):# the user id exist
                if (check_password(username, password) == True):# userid with right password
                    send_data = b'[authorized]:[public key]'
                    curr_prikey = new_prikey
                    is_authorization_complete = True

                else: # wring password
                    send_data = b'[unauthorized]:[Wrong password!]'

            else: # not exist user
                send_data = b'[unauthorized]:[User Not Exist!]'


        elif flag=='signup':# sign up
            
            if (check_username(username) == True):
                send_data = b'[unauthorized]:[User Exist!]'
            else:
                add_user(username, password) # add user to database
                send_data= b'[authorized]:[public key]'
                curr_prikey = new_prikey
                is_authorization_complete = True

        elif flag=='exit': # exit
            send_data = f'[exit]:[Time out!]'
            return 0



        '''Combine encrypted server response and new generated public key'''
        chipher_response = rsa.encrypt(send_data,client_public_key)
        await websocket.send(new_pubkey.save_pkcs1('PEM').decode("utf-8"))
        await websocket.send(chipher_response)


    print(f'Valid user: {username} and password: {password}')
    current_online.append(username)
    sys.stdout.flush()



    '''
        Ready for the chatting part
    '''
    # read the chatting sql table

    # example:
    '''_________________sql____________________'''

    create_messages_table('tom_jerry')
    create_messages_table('bob_tom')
    create_messages_table('tom_bob')

    # uncomment to add these messages to db
    #add_message('1', 'hello', '2010', 'tom_jerry')
    #add_message('2','hello tom','2010', 'bob_tom')
    #add_message('4','hello tom1','2010', 'bob_tom')
    #add_message('5','hello tom2','2010', 'bob_tom')
    #add_message('3','hello bob','2010', 'tom_bob')
    print('Reading history')
    sys.stdout.flush()

    
    chatting_relations = get_chatting_relations(username) # read the sql relation

    '''_________________sql____________________'''

    message_ids={} # message store the messages in a dictionary, use the message id as the key
                   # and the content will be [message sql relation name]:[message id]:[message]:[time]
    

    # sending history messages
    ''' new_message_cihper in this format [flag]:[message sql relation name]:[message id]:[message]:[time]
        example:[history]:[tom_jerry]:['1']:['hello']:['2010']
    '''
    print('Sending history')
    sys.stdout.flush()
    for Chat_title in chatting_relations.keys():

        if Chat_title.find(username)!=-1: # check is the message sql relation related to the user, including this user is the sender or receiver
            for m in chatting_relations[Chat_title]:
                message_ids[m[0]]=[Chat_title,m]
                new_message_cihper = rsa.encrypt(f'[history]:[{Chat_title}]:[{m[0]}]:[{m[1]}]:[{m[2]}]'.encode(),client_public_key)
                await websocket.send(new_message_cihper)
    print('Sending Finished')
    sys.stdout.flush()

    # after send all history, send the end flag
    new_message_cihper = rsa.encrypt(f'[end]:[None]:[None]:[None]:[None]'.encode(),client_public_key)
    await websocket.send(new_message_cihper)

    # all history has been send
    # start new message

    while True:
        # print(f'current online: {current_online}')
        # print(chatting_relations)
        # sys.stdout.flush()

        # recv the message from the client
        recv_request = (rsa.decrypt(await websocket.recv(),curr_prikey)).decode()
        fmt=re.compile(r'^\[(.*)\]:\[(.*)\]:\[(.*)\]:\[(.*)\]:\[(.*)\]')
        msg=fmt.match(recv_request).groups()

        print('recv:',recv_request)
        sys.stdout.flush()


        flag=msg[0]
        sender_receiver= msg[1] # sender to receiver
        message_id = msg[2]
        message = msg[3]
        s_time = msg[4]

        # print(flag,sender_receiver,message_id,message,s_time)
        # sys.stdout.flush()

        if flag == 's': # the data is a sending message
            receiver=sender_receiver[sender_receiver.find('_')+1:]
            # print('server',recv_request,check_username(receiver),receiver)
            # sys.stdout.flush()
            

            
            if check_username(receiver):

                if sender_receiver in chatting_relations.keys(): # if the message relation already exist just add to the message sql
                    add_message(message_id, message, s_time, sender_receiver)
                else:                                           # if the message relation is not exist, create a new relation and store the message
                    create_messages_table(sender_receiver)
                    add_message(message_id, message, s_time, sender_receiver)

                message_ids[message_id]=[sender_receiver,[message_id,message,s_time]] # add to the dictionary
                send_message_queue.append([sender_receiver,message_id,message,s_time]) # this queue is for let the server know what message need to send to the user
            else:
                send_message_queue.append([f'_{username}','None',message,s_time]) # this queue is for let the server know what message need to send to the user
                # print(send_message_queue)
                # sys.stdout.flush()


        elif flag == 'd': # deleting message
            print(recv_request)
            sys.stdout.flush()

            if message_id in str(message_ids.keys()):
                # print('before_delete',chatting_relations[message_ids[message_id][0]])
                sys.stdout.flush()

                # remove from the message sql relation
                for Chat_title in chatting_relations.keys():
                    if Chat_title.find(username)!=-1: # check is the message sql relation related to the user, including this user is the sender or receiver
                        for m in chatting_relations[Chat_title]:
                            if str(m[0]) == message_id: # check if message id entered matches message id in sql table
                                delete_message(Chat_title, int(message_id))

                                message_ids.pop(int(message_id)) # pop from the dictionary

                # print('after_delete',chatting_relations[message_ids[message_id][0]])
                # sys.stdout.flush()


        elif flag == 'c':
            new_message = f'[continue]:[None]:[None]:[None]:[None]'
            new_message_cihper = rsa.encrypt(new_message.encode(),client_public_key)
            await websocket.send(new_message_cihper)

        elif flag == 'da':# deleting the user
            # print('delete user')
            # sys.stdout.flush()
            delete_user(username)

            
            for Chat_title in list(chatting_relations.keys()):
                
                if Chat_title.find(username)!=-1: # check is the message sql relation related to the user, including this user is the sender or receiver
                    drop_message_table(Chat_title)
                    
            print(chatting_relations)
            sys.stdout.flush()


        else: # catch error
            print(f'unknown message from {username}')
            sys.stdout.flush()


        ''' for sending the new message which received by the server '''
        for mp in send_message_queue:
            # print('mp',mp,mp[0][mp[0].find('_')+1:],username,mp[0][mp[0].find('_')+1:]==username)
            # sys.stdout.flush()

            if mp[0][mp[0].find('_')+1:] == username: # find all new message that send to the user
                # print('send',mp,username)
                # sys.stdout.flush()
                new_message = f'[m]:[{mp[0]}]:[{mp[1]}]:[{mp[2]}]:[{mp[3]}]'
                print(new_message)
                sys.stdout.flush()
                new_message_cihper = rsa.encrypt(new_message.encode(),client_public_key)
                await websocket.send(new_message_cihper)
                send_message_queue.remove(mp)

        
        # send the end flag
        new_message = f'[end]:[None]:[None]:[None]:[None]'
        new_message_cihper = rsa.encrypt(new_message.encode(),client_public_key)
        await websocket.send(new_message_cihper)


async def server_process():
    async with websockets.serve(server_run, "localhost", 9999):
        await asyncio.Future()  # run forever


pubkey = 0
prikey = 0
valid_user = {} # for store user name and password
current_online = [] # for current online user
chatting_relations = {}
send_message_queue = []


def main():
    global pubkey
    global prikey

    print('Server start')
    create_users_table() # can comment out if databases are already created
    sys.stdout.flush()

    (pubkey,prikey)=rsa.newkeys(1024) # Generate the server public key and private key
    
    asyncio.run(server_process()) # start running
    
if __name__ == '__main__':
    main()
    
