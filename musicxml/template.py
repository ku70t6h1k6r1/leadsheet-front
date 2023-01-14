# -*- coding: utf-8 -*-

class Const:
    class Tie:
        def __init__(self):
            self.start = "start"
            self.stop = "stop"

    class BarStyle:
        def __init__(self):
            self.lightHeavy = "light-heavy"
            self.lightLight = "light-light"    
    
    class Beam:
        def __init__(self):
            self.begin = "begin"
            self.continue_ = "continue"
            self.end = "end" 

    class Stem:
        def __init__(self):
            self.up = "up"
            self.down = "down"
    
    class NoteType:
        def __init__(self):
            self.whole = "whole"
            self.half = "half"
            self.quarter = "quarter"
            self.eighth = "eighth"
            self._16th = "16th"

    class Harmony:
        def __init__(self):
            self.augmentedSeventh = "augmented-seventh"
            self.diminishedSeventh = "diminished-seventh"
            self.dominant = "dominant"
            self.dominant11th = "dominant-11th"
            self.halfDiminished = "half-diminished"
            self.majorMinor = "major-minor"
            self.majorSeventh = "major-seventh"
            self.minorSeventh = "minor-seventh"	
            

            self.major = "major"
            self.minor = "minor"
            self.major11th = "major-11th"
            self.suspendedFourth = "suspended-fourth"
            self.suspendedSecond = "suspended-second"
            self.diminished = "diminished"
            self.augmented = "augmented"

    class Part_Melody:
        def __init__(
            self, 
            name = "melody", 
            abbrevation = "mel.", 
            part_id = "P1",
            instrument_id = "P1-I1",
            midi_channel = "1"

            ):
            self.name = name
            self.instrument_name = name
            self.abbrevation = abbrevation
            self.part_id = part_id
            self.instrument_id = instrument_id
            self.midi_channel = midi_channel


    def __init__(self):
        self.barStyle = self.BarStyle()
        self.stem = self.Stem()
        self.noteType = self.NoteType()
        self.harmony = self.Harmony()
        self.tie = self.Tie()
        self.beam = self.Beam()
        self.partMelody = self.Part_Melody()

Const = Const()

class SongInfomation:
    def __init__(self, encoding_date,  title):
        self.encoding_date = encoding_date
        self.title = title

class ScoreInstrument:
    def __init__(self, instrument_id, instrument_name, midi_port, midi_channel, midi_program, midi_volume, midi_pan):
        self.id = instrument_id
        self.instrument_name = instrument_name
        self.midi_port = midi_port
        self.midi_channel = midi_channel
        self.midi_program = midi_program #instrument no
        self.midi_volume = midi_volume
        self.midi_pan = midi_pan

class ScorePart:
    def __init__(self, part_name, part_abbreviation, part_id) :
        self.scoreInstrument = None
        self.part_name = part_name
        self.part_abbreviation = part_abbreviation
        self.part_id = part_id

    def update_scoreInstrument(self, instrument_id, instrument_name, midi_channel, midi_port="1", midi_program="5", midi_volume="90", midi_pan="0"):
        self.scoreInstrument = ScoreInstrument(instrument_id, instrument_name, midi_port, midi_channel, midi_program, midi_volume, midi_pan)

class PartList:
    def __init__(self):
        self.part_list = []

    def append(self, scorepart):
        self.part_list.append(scorepart)

class Part:
    def __init__(self, part_id):
        self.part_id = part_id
        self.measures = []

    def append(self, measure):
        self.measures.append(measure)

class Time:
    def __init__(self, beat, beat_type):
        self.beat = beat
        self.beat_type = beat_type
    
class Clef:
    def __init__(self, sign, line):
        self.sign = sign
        self.line = line

class Attributes:
    def __init__(self, divisions, key_fifths, time, clef):
        self.divisions = divisions
        self.key_fifths = key_fifths
        self.time = time
        self.clef = clef

class Direction:
    def __init__(self, rehearsal):
        self.rehearsal = rehearsal

class Harmony:
    def __init__(self, root_step, root_alter, text, kind):
        self.root_step = root_step
        self.root_alter = root_alter
        self.text = text
        self.kind = kind

class Pitch:
    def __init__(self, step, octave, rootAlter):
        if step is None or octave is None:
            self.restflg = True
        else:
            self.restflg = False
        self.step = step
        self.octave = octave
        self.rootAlter = rootAlter

class Note:
    def __init__(self, step, octave, rootAlter, duration,dot, tie, tie2, voice, type, stem, beam):        
        self.pitch = Pitch(step, octave, rootAlter)
        self.duration = duration
        self.dot = dot
        self.tie = tie
        self.tie2 = tie2
        self.voice = voice
        self.type = type
        self.stem = stem
        self.beam = beam

class NoteWithHarmony:
    def __init__(self, note, harmony):
        self.note = note
        self.harmony = harmony

class Barline:
    def __init__(self, bar_style):
        self.bar_style = bar_style

class Measure:
    def __init__(self, number):
        #self.harmonies = []
        self.notes = []
        self.direction = None
        self.attributes = None
        self.barline = None
        self.new_system = False
        self.number=number

    def set_new_system(self):
        self.new_system = True

    def update_direction(self, rehearsal):
        self.direction = Direction(rehearsal)

    def update_attributes(self, divisions, key_fifths, time, clef):
        self.attributes = Attributes(divisions, key_fifths, time, clef)


    def delete_attributes(self):
        self.attributes = None


    def update_barline(self, bar_style):
        self.barline = Barline(bar_style)
    
    def update_notes(self, notes):
        #notes = []
        for note, chord in notes:            
            self.notes.append(
                NoteWithHarmony(note, chord)
            )