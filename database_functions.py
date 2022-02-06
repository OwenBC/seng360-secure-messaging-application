import sqlite3
import hashlib
from cryptography.fernet import Fernet

# Create Users table
def create_users_table():
    connection = sqlite3.connect('Messaging.db')
    cursor = connection.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users
                  (username TEXT, password BLOB)''')
    connection.commit()
    connection.close()

# check if username entered is valid
def check_username(username):
    connection = sqlite3.connect('Messaging.db')
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE username='%s'" % (username))
    user = cursor.fetchall()
    # verify if user is present in table
    if user:
        check = True
    else:
        check = False

    connection.commit()
    connection.close()

    return check

# check if password entered is correct
def check_password(username, password):
    connection = sqlite3.connect('Messaging.db')
    cursor = connection.cursor()

    # Hash password
    key = hashlib.pbkdf2_hmac(
        'sha256',
        str(password).encode('utf-8'),
        b'\xff',
        100000
    )

    cursor.execute("SELECT * FROM users WHERE username=? AND password=?", (username, key))
    user = cursor.fetchall()

    # verify if password was present in db for user
    if user:
        check = True
    else:
        check = False

    connection.commit()
    connection.close()

    return check

# add a user to the users table
def add_user(username, password):
    connection = sqlite3.connect('Messaging.db')
    cursor = connection.cursor()

    # Hash password
    key = hashlib.pbkdf2_hmac(
        'sha256',
        str(password).encode('utf-8'),
        b'\xff',
        100000
    )

    cursor.execute("INSERT INTO users (username,password) VALUES (?, ?)", (username, key))
    
    connection.commit()
    connection.close()

def delete_user(username):
    connection = sqlite3.connect('Messaging.db')
    cursor = connection.cursor()

    cursor.execute("DELETE FROM users WHERE username LIKE '%s'" % (username))
    
    connection.commit()
    connection.close()

# Create Messages table for sender_reciever
def create_messages_table(sender_receiver):
    connection = sqlite3.connect('Messaging.db')
    cursor = connection.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS %s
                  (messageId INT, message BLOB, timestamp TEXT)''' % (sender_receiver))
    connection.commit()
    connection.close()

# Add message to db and encrypt message
def add_message(id, message, timestamp, sender_recv):
    sender, recipient = sender_recv.split("_", 1) 
    connection = sqlite3.connect('Messaging.db')
    cursor = connection.cursor()

    # Generate key and save it
    cursor.execute('''CREATE TABLE IF NOT EXISTS keys
                  (messageId INT, key BLOB)''')
    key = Fernet.generate_key()
    cursor.execute("INSERT INTO keys (messageId, key) VALUES (?, ?)", (id, key))

    # Encrypt message
    f = Fernet(key)
    encrypted_message = f.encrypt(message.encode())

    # Insert message into db
    cursor.execute("INSERT INTO %s (messageId, message, timestamp) VALUES (?, ?, ?)" % (sender_recv), (id, encrypted_message, timestamp))

    connection.commit()
    connection.close()

# check if message table exists
def check_for_message_table(sender_recv):
    connection = sqlite3.connect('Messaging.db')
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM %s" % (sender_recv))
    table = cursor.fetchall()
    if table:
        check = True
    else:
        check = False

    connection.commit()
    connection.close()

    return check

# create dictionary with table name as key and all the messaging data as value
def get_chatting_relations(user):
    connection = sqlite3.connect('Messaging.db')
    cursor = connection.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name <> 'users'")
    # returns the tables in a list of tuples e.g [('tom_bob',), ('bob_tom',)]
    tables = cursor.fetchall()

    # create chatting relations dictionary e.g ['tom_bob': [('1', 'Hello', '2010'),('2', 'Hi bob', '2010')], etc]
    chatting_relations = {}
    for table in tables:
        if str(table[0]).find(user) != -1:
            cursor.execute("SELECT * FROM %s" % (table))
            data = cursor.fetchall()

            # decrypt the message
            decrypted_data = []
            for i in data:
                message_id = i[0]
                cursor.execute("SELECT key from keys WHERE messageId=%d" % (int(message_id)))
                key = cursor.fetchall()[0][0]
                f = Fernet(key)
                decrypted_message = f.decrypt(i[1]).decode()
                # add the message_id, decrypted message and timestamp to array
                decrypted_data.append((message_id, decrypted_message, i[2])) 

            chatting_relations[table[0]] = decrypted_data

    connection.commit()
    connection.close()

    return chatting_relations

def drop_message_table(table_name):
    connection = sqlite3.connect('Messaging.db')
    cursor = connection.cursor()
    
    cursor.execute("DROP TABLE IF EXISTS %s" % (table_name))

    connection.commit()
    connection.close()

def delete_message(table_name, message_id):
    connection = sqlite3.connect('Messaging.db')
    cursor = connection.cursor()
    cursor.execute("DELETE FROM '%s' WHERE messageId=%d" % (table_name, message_id))
    cursor.execute("DELETE FROM keys WHERE messageId=%d" % (message_id)) # remove key associated with message    

    connection.commit()
    connection.close()   

def print_table(table):
    connection = sqlite3.connect('Messaging.db')
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM '%s'" % (table))
    rows = cursor.fetchall()

    for row in rows:
        print(row)

    connection.commit()
    connection.close()