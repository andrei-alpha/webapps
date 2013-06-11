from ctypes import cdll
import os

# Comment the next two lines for a fast startup
os.system('cd owari/static/cpp && sh compile.sh && mv libai.so ../../.')
os.system('pwd')

lib = cdll.LoadLibrary('./owari/libai.so')

class Ai(object):
    def __init__(self):
        self.obj = lib.Ai_new()
    
    def bar2(self, param):
        lib.Ai_bar(self.obj, param)
    
    def move(self, board, score1, score2, cur, level):
        return lib.Ai_move(self.obj, board, score1, score2, cur, level)
    
def compute(board, score1, score2, cur, level):
    ai = Ai()

    '''
    board = '5 5 5 4 0 5 5 5 5 4 0 5 '    
    score1 = 0
    score2 = 0
    cur = 0
    level = 10
    '''

    board = str(board)
    score1 = int(score1)
    score2 = int(score2)
    cur = int(cur)
    level = int(level)

    if level > 10:
        level = 10
    
    print board
    print score1, score2, cur, level

    res = ai.move(board, score1, score2, cur, level)

    print '>>>', res

    return str(res)

