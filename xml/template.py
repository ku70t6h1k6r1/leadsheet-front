# -*- coding: utf-8 -*-

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
        self.key_fifts = key_fifths
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

class Note:
    def __init__(self, step, octave, duration, tie, voice, type, stem):        
        self.step = step
        self.octave = octave
        self.duration = duration
        self.tie = tie
        self.voice = voice
        self.type = type
        self.stem = stem

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
        self.number=number

    def update_direction(self, rehearsal):
        self.direction = Direction(rehearsal)

    def update_attributes(self, divisions, key_fifths, time, clef):
        self.attributes = Attributes(divisions, key_fifths, time, clef)

    def update_barline(self, bar_style):
        self.barline = Barline(bar_style)
    
    def update_notes(self, notes):
        notes = []
        for note, chord in notes:
            note_xml = Note(
                note["step"],
                note["octave"],
                note["duration"],
                note["tie"],
                note["voice"],
                note["type"],
                note["stem"]
            )
            if chord:
                chord_xml = Harmony(
                    chord["root_step"],
                    chord["root_alter"],
                    chord["text"],
                    chord["kind"]
                )
            else:
                chord_xml = None
            
            notes.append(
                {"note": note_xml, "harmony" : chord_xml}
            )