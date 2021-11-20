import websocket as ws;
import configparser
import json

config = configparser.ConfigParser()
config.read('conf/config.ini')

address = None
port = None

def printBoard(board):
  print('------ BOARD ------')
  print('    A  B  C  D  E  F  G  H')
  print('    -----------------------')
  for idx, row in enumerate(reversed(board)):
    s = str(8 - idx) + ' | '
    for cell in row:
      if cell != None:
        s += cell['color'] + cell['type'][0] + ' '
      else:
        s += '.  '
    print(s)
  print('    -----------------------')

def printMoves(movesBoard):
  print('------ MOVES ------')
  print('    A  B  C  D  E  F  G  H')
  print('    -----------------------')
  for idx, row in enumerate(reversed(movesBoard)):
    s = str(8 - idx) + ' | '
    for cell in row:
      if cell:
        s += 't' + '  '
      else:
        s += 'n  '
    print(s)
  print('    -----------------------')
  
try:
  address = config['DEFAULT']['ADDRESS']
  port = config['DEFAULT']['PORT']
except KeyError:
  print('Configuration not loaded correctly. Closing program')
  exit()

destination = 'ws://' + address + ':' + port
user1Name = 'user1Test'
user2Name = 'user2Test'
roomName = 'testRoom'

if __name__ == "__main__":

  user1Socket = ws.create_connection(destination + '/' + user1Name)
  user1Data = json.loads(user1Socket.recv())
  user1Data = user1Data['data']
  user1Socket.recv()

  user2Socket = ws.create_connection(destination + '/' + user2Name)
  user2Data = json.loads(user2Socket.recv())
  user2Data = user2Data['data']
  user2Socket.recv()

  user1Socket.send(json.dumps({'type': 'CREATE_ROOM', 'data': {'roomName': roomName}}))
  roomData = json.loads(user1Socket.recv())
  roomData = roomData['data']
  user1Socket.recv()

  user2Socket.send(json.dumps({'type': 'JOIN_ROOM', 'data':{'roomId': roomData['roomId']}}))
  user2Socket.recv()
  roomData = json.loads(user2Socket.recv())
  roomData = roomData['data']
  user1Socket.recv()
  user1Socket.recv()

  user1Socket.send(json.dumps({'type': 'START', 'data':{'roomId': roomData['roomId']}}))
  user2Socket.recv()
  user2Socket.recv()
  roomData = json.loads(user1Socket.recv())['data']
  currentUser = None
  user1Color  = roomData['user1Color']
  currentColor = 'w'
  # if roomData['user1Color'] == 'w':
  #   currentUser = (user1Socket, user1Data)
  # else:
  #   currentUser = (user2Socket, user2Data)

  inputCommand = ''
  commands = ['help', 'exit', 'move', 'check']
  while inputCommand != 'exit':
    print('\n')
    print(f"half moves: {roomData['boardData']['halfMoves']}, turn: {roomData['boardData']['turn']}, result: {roomData['boardData']['result']}")
    printBoard(roomData['boardData']['board'])

    currentColor = roomData['boardData']['turnColor']
    if currentColor == user1Color:
      currentUser = (user1Socket, user1Data)
    else:
      currentUser = (user2Socket, user2Data)
    print('Current turn: ' + currentColor)

    inputCommand = input ('BoardTester> ')
    enteredCommand = inputCommand.split()[0]
    if enteredCommand == commands[0]:
      print(('--- COMMANDS ---' '\n'
        'help - opens this description' '\n'
        'exit - closes program' '\n'
        'makeMove <from> <to> - makes move on board. For example> makeMove A1 B5' '\n'
      ))
    elif enteredCommand == commands[1]:
      print('Closing program')
      exit()
    elif enteredCommand == commands[2]:
      frm = inputCommand.split()[1]
      to = inputCommand.split()[2]
      currentUser[0].send(json.dumps({'type': 'MAKE_MOVE', 'data':{'roomId': roomData['roomId'], 'from': frm, 'to': to}}))
      tmp = json.loads(currentUser[0].recv())
      if tmp['type'] == 'BOARD_UPDATED':
        roomData = tmp['data']['room']
        if currentUser[0] == user1Socket:
          user2Socket.recv()
        else:
          user1Socket.recv()
      elif tmp['type'] == 'ERROR':
        print('Error received: ' + tmp['data'])
      
      print(tmp['type'])
    elif enteredCommand == commands[3]:
      frm = inputCommand.split()[1]
      currentUser[0].send(json.dumps({'type': 'CHECK_FOR_MOVE', 'data':{'roomId': roomData['roomId'], 'from': frm}}))
      tmp = json.loads(currentUser[0].recv())
      if tmp['type'] == 'ERROR':
        print('Error received: ' + tmp['data'])
      else:
        printMoves(tmp['data']['movesBoard'])
    else:
      print('Unrecognized command')


