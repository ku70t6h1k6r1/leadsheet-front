# coding: UTF-8
import numpy as np
import math

class Functions:
    def convertIndexToSymbol(self, idx, rootSymbol, chordSymbol):
        if idx is None:
            return "N.C."
        else:
            root = rootSymbol[math.floor(idx / len(chordSymbol))]
            symbol = chordSymbol[idx % len(chordSymbol)]
            return root+symbol

    def transpose(self, idx, add_note, chordSymbol):
        root = math.floor(idx / len(chordSymbol))
        root += add_note
        root = root % 12 if root >= 0 else root + 12
        return int( root *  len(chordSymbol) + idx % len(chordSymbol) )



class Set:
    def __init__(self, chords_dict,  rootSymbols, chordSymbols):
        self.chords_dict = chords_dict
        self.rootSymbols = rootSymbols
        self.chordSymbols = chordSymbols

        self.chordIdxs = []        
        for rootSymbol in self.rootSymbols:
            for chordSymbol in self.chordSymbols:
                cidx = self.getIdxFromSymbol( rootSymbol, chordSymbol)
                self.chordIdxs.append(cidx)
        
    def getSymbolFromIdx(self, idx):
        return Func.convertIndexToSymbol(idx, self.rootSymbols, self.chordSymbols)

    def transposeFromIdx(self, idx,  add_note):
        idx_new = Func.transpose(idx, add_note, self.chordSymbols)
        return idx_new

Func = Functions()