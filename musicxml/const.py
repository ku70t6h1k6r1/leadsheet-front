# coding: UTF-8

class Const:
    def __init__(self):
        self.type____chord_progression = "chord-progression"
        self.type____chord_progression_symbol = "chord-progression-symbol"
        self.type____key = "key"
        self.type____melody = "melody"

        self.note_hold = -1
        self.note_rest = -2
        self.midinote_lowest = 55 #G3
        self.midinote_highest = 86 #D6
        self.midinote_G4 = 67 

        self.midinote_lowest_root = 58 #Bb3
        self.midinote_highest_root = 69 #A4 440Hz

        self.scale_quality____major = 0
        self.scale_quality____naturalminor = 1
        self.scale_quality____harmonicminor = 2

        self.timesignature_44 = "4/4"
        self.timesignature_34 = "3/4"

        self.division_1 = 1
        self.division_2 = 2
        self.division_16 = 16
        self.division_12 = 12
        


Const = Const()