# coding: UTF-8 
from scoreobj.chords_functions import Set
import numpy as np

"""
コードセットを下に追記していく。
"""

class Triad:
    def __init__(self):
        """
        0:I
        1:Im
        2:I2
        3:I4
        4:Iaug
        5:Idim
        """

        self.chords_dic = {\
            0:[0, 4, 7], \
            1:[0, 3, 7], \
            2:[0, 2, 7], \
            3:[0, 5, 7], \
            4:[0, 4, 8], \
            5:[0, 3, 6] \
            }

        self.chords_dic_avoid_notes = {\
            0:[1, 3, 5, 8], \
            1:[1, 3, 5, 8], \
            2:[1, 8], \
            3:[1, 8], \
            4:[1, 3, 5, 7, 9], \
            5:[1, 4, 7, 9] \
            }

        self.rootSymbols = np.array(["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"])
        self.chordSymbols = np.array([" ","m","sus2","sus4","aug","dim"])
        self.chordIdx = Set(self.chords_dic, self.chords_dic_avoid_notes, self.rootSymbols, self.chordSymbols)

class Tetrad:
    def __init__(self) :

        """
        #DEFAULT
        0:IM7
        1:I7
        2:Im7
        3:ImM7
        4:IM7+5
        5:I7+5
        6:Im7-5
        7:Idim7
        """

        self.chords_dic_avoid_notes = {\
            0:[1, 3, 5, 8, 10], \
            1:[1, 3, 5, 8, 11], \
            2:[1, 4, 6, 8, 9, 11], \
            3:[1, 4, 6, 8, 10], \
            4:[1, 3, 5, 7, 9, 10], \
            5:[1, 3, 5, 7, 9, 11], \
            6:[1, 4, 7, 9, 11], \
            7:[1, 4, 7, 9, 10, 11] \
            }

        self.chords_dic = {\
            0:[0, 4, 7, 11], \
            1:[0, 4, 7, 10], \
            2:[0, 3, 7, 10], \
            3:[0, 3, 7, 11], \
            4:[0, 4, 8, 11], \
            5:[0, 4, 8, 10], \
            6:[0, 3, 6, 10], \
            7:[0, 3, 6, 9] \
            }

        self.rootSymbols = np.array(["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"])
        self.chordSymbols = np.array(["M7","7","m7","mM7","M7+5","7+5","m7-5","dim7"])
        self.chordIdx = Set(self.chords_dic, self.chords_dic_avoid_notes, self.rootSymbols, self.chordSymbols)



Tetrad = Tetrad()
Triad = Triad()



if __name__ == '__main__':
    tetrad = Tetrad().chordIdx
    #print(tetrad.getSymbolFromIdx(49))
    #print(tetrad.getTonesFromIdx(49))
    print(tetrad.getIdxFromSymbol("Gb","7"))
