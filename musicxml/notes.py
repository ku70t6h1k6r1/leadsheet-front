# -*- coding: utf-8 -*-

from copy import deepcopy
import math
from musicxml.template import Const, Note, Time, Harmony
from musicxml.const import Const as ScoreConst


class Notes:
    """
    No use for triplet
    """
    class NoteDuration:
        def __init__(self, division, n_beat, value, alter):
            self.division = division
            self.n_beat = n_beat
            self.value = value
            self.alter = alter


    def stem(self, midinote):
        if midinote is None:
            return None

        if midinote >= 70 :
            return Const.stem.down
        else:
            return Const.stem.up

    def tie(self, midinote_post):
        if midinote_post is None:
            return None
        
        if self.check_note_hold(midinote_post):
            return Const.tie.start

        return None    

    def noteType(self, time, division, n_beat):
        if self.check_44(time):
            if n_beat == division:
                return Const.noteType.whole, False
            
            elif n_beat == int(division * 12 /16):
                return Const.noteType.half, True

            elif n_beat == int(division * 8 /16):
                return Const.noteType.half, False

            elif n_beat == int(division * 6 /16):
                return Const.noteType.quarter, True

            elif n_beat == int(division * 4 /16):
                return Const.noteType.quarter, False

            elif n_beat == int(division * 3 /16):
                return Const.noteType.eighth, True

            elif n_beat == int(division * 2 /16):
                return Const.noteType.eighth, False

            elif n_beat == int(division * 1 /16):
                return Const.noteType._16th, False

            else:
                return None, False
        elif self.check_34(time):
            if n_beat == division:
                return Const.noteType.half, True
            
            elif n_beat == int(division * 8 /12):
                return Const.noteType.half, False

            elif n_beat == int(division * 6 /12):
                return Const.noteType.quarter, True

            elif n_beat == int(division * 4 /12):
                return Const.noteType.quarter, False

            elif n_beat == int(division * 3 /12):
                return Const.noteType.eighth, True

            elif n_beat == int(division * 2 /12):
                return Const.noteType.eighth, False

            elif n_beat == int(division * 1 /12):
                return Const.noteType._16th, False

            else:
                return None, False

        else:
            return None, False

    def get_noteType_length(self, time, division):
        if self.check_44(time):
            if division == 16:
                return {Const.noteType.whole : 16, Const.noteType.half : 8, Const.noteType.quarter : 4, Const.noteType.eighth : 2,  Const.noteType._16th :1}
        if self.check_34(time):
            if division == 12:
                return {Const.noteType.whole : None, Const.noteType.half : 8, Const.noteType.quarter : 4, Const.noteType.eighth : 2,  Const.noteType._16th :1}
 

        return {Const.noteType.whole : None, Const.noteType.half : None, Const.noteType.quarter : None, Const.noteType.eighth : None,  Const.noteType._16th :None}

    def get_noteType_length(self, time, division):
        if self.check_44(time):
            if division == 16:
                return {Const.noteType.whole : 16, Const.noteType.half : 8, Const.noteType.quarter : 4, Const.noteType.eighth : 2,  Const.noteType._16th :1}
        if self.check_34(time):
            if division == 12:
                return {Const.noteType.whole : None, Const.noteType.half : 8, Const.noteType.quarter : 4, Const.noteType.eighth : 2,  Const.noteType._16th :1}
 

        return {Const.noteType.whole : None, Const.noteType.half : None, Const.noteType.quarter : None, Const.noteType.eighth : None,  Const.noteType._16th :None}


    def check_44(self, time):
        if time.beat == 4 and time.beat_type == 4:
            return True
        else:
            return False

    def check_34(self, time):
        if time.beat == 3 and time.beat_type == 4:
            return True
        else:
            return False

    def check_note_on(self, note):
        if note in  [Const.note.hold, Const.note.rest]:
            return False

        else:
            return True

    def check_note_hold_or_rest(self, note):
        if note in  [Const.note.hold, Const.note.rest]:
            return True

        else:
            return False

    def check_note_hold(self, note):
        if note == Const.note.hold:
            return True

        else:
            return False


    def check_note_rest(self, note):
        if note == Const.note.rest:
            return True

        else:
            return False    

    def content2duratin(self, division, content):
        noteduration_list = []
        for note, alter in content:
            noteduration_list.append(
                self.NoteDuration(division, 1, note, alter)
            )
            
        return noteduration_list

    def convert_division(self, content, division_pre, division_post):
        unit_div = float(division_post) / float(division_pre) # 2 ,4 

        content_post = []
        ids_ = []
        for beat in range(division_post):
            if beat % unit_div == 0 :
                content_post.append( content[int(beat/unit_div)] )
                ids_.append(beat)
            else: 
                content_post.append(None)

        return content_post, ids_ 

    def convert_division_chord(self, content, division_pre, division_post):
        unit_div = float(division_post) / float(division_pre) # 2 ,4 

        content_post = []
        ids_ = []

        past_chord = None
        for beat in range(division_post):
            if beat % unit_div == 0 :
                current_chord = content[int(beat/unit_div)]
                if current_chord == past_chord:
                    content_post.append( None )
                else:
                    content_post.append( current_chord )
                    ids_.append(beat)

                past_chord = current_chord
            else: 
                content_post.append(None)

        return content_post, ids_ 


    def whole(self,  time, division,  noteduration_list):
        """
        Main
        - whole note typeの確認
        """
        if len(noteduration_list) <= 1:
            return noteduration_list
        
        
        for  noteDuration in noteduration_list[1:]:
            if not self.check_note_hold(noteDuration.value) :
                return noteduration_list


        noteduration_list_whole = []
        for _ in range(division) :
            noteduration_list_whole.append(
                self.NoteDuration(division, 0, None, None)
            )

        noteduration_list_whole[0] = self.NoteDuration(division, division, noteduration_list[0].value, noteduration_list[0].alter)
        return noteduration_list_whole



    def half(self, noteduration_list):
        """
        Format Check
        """ 
        if len(noteduration_list) == 0:
            return noteduration_list
        
        division = noteduration_list[0].division
        if division % 2 == 1:
            return  noteduration_list

        """
        Main
        - ユニット単位を一個飛ばしでまとめていく。
        - 小さい方から大きい方へまとめている。
        """
        count = 0 
        while True:
            count += 1
            beat_unit =  2 ** count

            if division <= beat_unit:
                break

            if int(division/beat_unit) != division/beat_unit:
                break 

            noteduration_list_half = []
            #COUNT : 2 beat_unit : 4 target : 2
            for unit_id in range(  int(division/beat_unit) ):
                noteDuration_0 = noteduration_list[ beat_unit * unit_id ]
                noteDuration_1= noteduration_list[ beat_unit * unit_id + int(beat_unit/2)]

                if self.check_note_hold(noteDuration_1.value) and (noteDuration_0.n_beat == noteDuration_1.n_beat) and (noteDuration_0.n_beat == int(beat_unit/2)):
                    for _ in range(beat_unit):
                        noteduration_list_half.append(
                            self.NoteDuration(division, 0, None, None)
                        )
                    noteduration_list_half[-beat_unit] = self.NoteDuration(division, beat_unit, noteDuration_0.value, noteDuration_0.alter) 

                else:
                    for noteduration in noteduration_list[beat_unit*unit_id : beat_unit*(unit_id+1)]:
                        noteduration_list_half.append(
                            noteduration
                        )


            noteduration_list = deepcopy(noteduration_list_half)

        return noteduration_list

    def half_stepped(self,  time, division,  noteduration_list):
        """
        Format Check
        """ 
        if len(noteduration_list) == 0:
            return noteduration_list
        
        #division = noteduration_list[0].division
        if division % 2 == 1:
            return  noteduration_list

        """
        Main
        - 大きい方から小さい方へまとめている。
        - ユニットで1.5か2倍に出来る奴をまとめる。分割してるやつ。
        - Even-MeterをEvenでぶ
        """

        noteTypes_length = self.get_noteType_length(time, division)
        noteTypes = [Const.noteType.half, Const.noteType.quarter, Const.noteType.eighth, Const.noteType._16th]
        for noteType in noteTypes:

            beat_unit =  noteTypes_length[noteType] 
            break_beat = beat_unit * (2 ** 2) 

            #Example
            #3/4 count = 2; beat_unit = 3; break_beat = 12
            #count = 4; beat_unit = 1; break_beat = 4

            #if break_beat > division:
            #    print("break_beat OVER division")
            #    continue

            
            for unit_id in range(  int(division/beat_unit) ):
                beat = beat_unit * unit_id
                beat_target = beat_unit *  (unit_id + 1)

                 
                if  beat_target >= division: 
                    continue

                if math.floor(beat / break_beat) !=  math.floor(beat_target / break_beat):
                    #BREAK BEAT ラインを超えたらダメ
                    continue

                noteDuration = noteduration_list[ beat ]
                noteDuration_target= noteduration_list[ beat_target ]

                if noteDuration.n_beat != beat_unit:
                    continue

                if not self.check_note_hold(noteDuration_target.value):
                    continue

                if (noteDuration.n_beat + noteDuration_target.n_beat) % 1.5 != 0 and (noteDuration.n_beat + noteDuration_target.n_beat) / (beat_unit * 2) != 1:
                    continue

                noteduration_list[ beat ] = self.NoteDuration(division, noteDuration.n_beat + noteDuration_target.n_beat  ,noteDuration.value, noteDuration.alter)
                noteduration_list[ beat_target ] = self.NoteDuration(division, 0  ,None, None)

        return noteduration_list 

    def divide_harmonicRhythm(self, noteduration_list, points):
        noteDuraiton_pre = None
        beat_pre = None
        for beat, noteDuraiton in enumerate(noteduration_list):
            if noteDuraiton.n_beat == 0:
                if beat in points:
                    if noteDuraiton_pre :
                        beat_n_divide_pre = beat - beat_pre
                        beat_n_divide_post = noteDuraiton_pre.n_beat - beat_n_divide_pre #noteDuraiton_pre.n_beat + beat_pre - beat
                        noteduration_list[beat_pre] = self.NoteDuration(noteDuraiton_pre.division,  beat_n_divide_pre, noteDuraiton_pre.value)
                        noteduration_list[beat] = self.NoteDuration(noteDuraiton_pre.division,  beat_n_divide_post, Const.note.hold)
            else:
                noteDuraiton_pre = noteDuraiton
                beat_pre = beat

        return noteduration_list

    def midinote2notename(self, midinote, accidentalNotation):
        if midinote is None:
            return None, None, None
        
        note_list_sharp = [
            ["C", None],
            ["C", 1],
            ["D", None],
            ["D", 1],
            ["E", None],
            ["F", None],
            ["F", 1],
            ["G", None],
            ["G", 1],
            ["A", None],
            ["A", 1],
            ["B", None]
        ]

        note_list_flat = [
            ["C", None],
            ["D", -1],
            ["D", None],
            ["E", -1],
            ["E", None],
            ["F", None],
            ["G", -1],
            ["G", None],
            ["A", -1],
            ["A", None],
            ["B", -1],
            ["B", None]
        ]


        octave = math.floor(midinote / 12) - 1
        notenumber = midinote % 12
        if accidentalNotation == 1:
            step, rootAlter = note_list_sharp[notenumber]
        elif accidentalNotation == -1:
            step, rootAlter = note_list_flat[notenumber]
        else:
            step, rootAlter = note_list_flat[notenumber]

        return  step, octave, rootAlter


    def timeSignature(self, timeSignature):
        if timeSignature == ScoreConst.timesignature_44:
            return Time(4,4)
        elif timeSignature == ScoreConst.timesignature_34:
            return Time(3,4)
        else:
            return Time(4,4)

    def fix_beam_half(self, time, division, notes):
        notes_group = [[]]

        if self.check_44(time):
            half_length = int(division/2)
        elif self.check_34(time):
            half_length = int(division/1.5)


        for note_info in notes:
            note, chord = note_info

            notes_group[-1].append(note)

            length_ = 0
            for note_current in notes_group[-1]:
                length_ += note_current.duration

            if length_ % half_length == 0:
                notes_group.append([])


        for notes_half in notes_group:
            #// 全部eightthかどうか
            all_eighth_flg = True
            # //

           #//stemの上下
            stem_up = 0
            stem_down = 0

            for note in notes_half:
                if note.pitch.step:
                    if note.stem == Const.stem.up:
                        stem_up += 1
                    elif note.stem == Const.stem.down:
                        stem_down += 1
                    else:
                        pass

                #// 全部eightthかどうか
                if note.type != Const.noteType.eighth :
                    all_eighth_flg = False
                elif note.dot:
                    all_eighth_flg = False

                # //
            # stemの上下//


            if all_eighth_flg : 

                if stem_up > stem_down:
                    stem = Const.stem.up
                else:
                    stem = Const.stem.down

                # //beam修正
                start_flg = False
                note_on_last_id = None
                for id_, note in enumerate(notes_half):
                    if start_flg:
                        note.stem = stem
                        note.beam = Const.beam.continue_

                    else:
                        if note.pitch.step:
                            note.stem = stem
                            note.beam = Const.beam.begin
                            start_flg = True

                    if note.pitch.step:
                        note_on_last_id = id_

                if note_on_last_id is not None:
                    if notes_half[note_on_last_id].beam == Const.beam.continue_ :
                        notes_half[note_on_last_id].beam = Const.beam.end

    def fix_beam_quarter(self, time, division, notes):
        notes_group = [[]]

        if self.check_44(time):
            quarter_length = int(division/4)
        elif self.check_34(time):
            quarter_length = int(division/3)



        for note_info in notes:
            note, chord = note_info

            notes_group[-1].append(note)

            length_ = 0
            for note_current in notes_group[-1]:
                length_ += note_current.duration

            if length_ % quarter_length == 0:
                notes_group.append([])

        #print("QUARTER START")
        for notes_quarter in notes_group:
            #//stemの上下
            stem_up = 0
            stem_down = 0

            for note in notes_quarter:
                #print("----")
                #print("note.pitch.step : ", note.pitch.step)
                if note.pitch.step:
                    if note.stem == Const.stem.up:
                        stem_up += 1
                    elif note.stem == Const.stem.down:
                        stem_down += 1
                    else:
                        pass
                #print("up/down", stem_up, stem_down)
                #print("----")

            if stem_up > stem_down:
                stem = Const.stem.up
            else:
                stem = Const.stem.down
            # stemの上下//

            # //beam修正
            start_flg = False
            beam_last_id = None
            for id_, note in enumerate(notes_quarter):
                if start_flg:
                    note.stem = stem
                    note.beam = Const.beam.continue_

                else:
                    if note.pitch.step:
                        note.stem = stem
                        note.beam = Const.beam.begin
                        start_flg = True

                #
                if note.beam: 
                   beam_last_id = id_

                if not note.pitch.step: #この心は？
                    start_flg = False #


            if beam_last_id is not None:
                if notes_quarter[beam_last_id].beam == Const.beam.continue_ :
                    notes_quarter[beam_last_id].beam = Const.beam.end

    def remove_beam_begin_without_end(self, notes):
        for id_, note_info in enumerate(notes[:-2]):
            note, chord = note_info
            note_post, chord_post = notes[id_ + 1]

            if note.beam == Const.beam.begin:
                if not  note_post.beam in [Const.beam.continue_, Const.beam.end] :
                    note.beam = None
        
        note, chord = notes[-1]
        if note.beam == Const.beam.begin:
            note.beam = None

    def remove_beam_begin_over_qurter(self, notes):
        begin_lost_flg = False
        for id_, note_info in enumerate(notes):
            note, chord = note_info
            if note.type in [Const.noteType.whole, Const.noteType.half, Const.noteType.quarter]:
                if note.beam == Const.beam.begin:    
                    note.beam = None
                    begin_lost_flg = True
            else:
                if begin_lost_flg:  
                    if note.beam == Const.beam.end : #, Const.beam.continue_ ]: 
                        note.beam = None
                        begin_lost_flg = False
                    elif note.beam == Const.beam.continue_:
                        note.beam = Const.beam.begin
                        begin_lost_flg = False

    def add_tie2(self, notes, midinote_nextbar):
        for id_, note_info in enumerate(notes):
            note, _ = note_info
            tie = note.tie

            if id_ + 1 < len(notes):
                note_next, _ =  notes[id_ + 1]
                tie_next = note_next.tie
            else:
                if self.check_note_hold(midinote_nextbar):
                    tie_next = Const.tie.stop
                else:
                    tie_next = None

            if tie == Const.tie.stop and tie_next == Const.tie.stop :
                note.tie2 = Const.tie.start



    def accidentalNotation(self, keyfifths):
        return 1 if keyfifths > 0 else -1


    def get_attribute_division(self, time, division):
        if self.check_44(time):
            return int(division/4)

        elif self.check_34(time):
            return int(division/3)

        else:
            return 4 #とりあえずの16th

    def keyFifths(self, key_):
        root, quality = key_
        if quality == ScoreConst.scale_quality____major:
            pass
        elif quality in [ScoreConst.scale_quality____naturalminor, ScoreConst.scale_quality____harmonicminor]:
            root = (root + 3 ) % 12

        if root == 0: #C Am
            return 0
        elif root == 7: #G Em
            return 1
        elif root == 2: #D Bm
            return 2
        elif root == 9: #A F#m
            return 3
        elif root == 4: #E C#m
            return 4
        elif root == 11: #B G#m
            return 5

        elif root == 5: #F Dm
            return -1 
        elif root == 10: #Bb Gm
            return -2
        elif root == 3: #Eb Cm
            return -3
        elif root == 8: #Ab Fm
            return -4
        elif root == 1: #Db Bbm
            return -5
        elif root == 6: #Gb Ebm
            return -6

    def is_equal_attribute(self, attr_0, attr_1):
        if attr_0.divisions != attr_1.divisions:
            return  False
        elif attr_0.key_fifths != attr_1.key_fifths:
            return False
        elif not self.is_equal_time(attr_0.time, attr_1.time):
            return False
        elif not self.is_equal_clef(attr_0.clef, attr_1.clef):
            return False


        return True

    def final(self, time, division, accidentalNotation, melody, chords, past_note_on,  next_note):
        """
        ONE BAR
        """
        #chords, chord_ids = self.convert_division_chord(chords["content"], chords["division"], division)

        noteduration_list = self.content2duratin(division, melody)
        noteduration_list = self.whole(time, division, noteduration_list)
        noteduration_list = self.half(noteduration_list)
        noteduration_list = self.half_stepped(time, division, noteduration_list)
        #noteduration_list = self.divide_harmonicRhythm(noteduration_list, chord_ids)


        notes = []
        for beat, noteDuration in enumerate(noteduration_list):
            #chord = chords[beat]
            chord = None

            #if chord is not None: 
            #    chord_root = int(ChordSet.chordIdx.getTonesFromIdx(chord)[0])
            #    chord_quality = ChordSet.chordIdx.getQualityFromIdx(chord)
            #    chord_rootStep, _, chord_rootAlter = MXMLFunction.midinote2notename(chord_root, accidentalNotation)
            #    kindValue = MXMLFunction.convertQulity2Harmony(chord_quality)
            #    chord = Harmony(chord_rootStep, chord_rootAlter, "", kindValue)



            if noteDuration.n_beat == 0:
                continue
            
            cnt = 0
            while True:
                cnt += 1
                if beat + cnt < len(noteduration_list):
                    if noteduration_list[beat+cnt].n_beat > 0:
                        midinote_post =  noteduration_list[beat+cnt].value
                        break
                else:
                    midinote_post = next_note
                    break
 
            if self.check_note_on(noteDuration.value):

                past_note_on = noteDuration
                #past_value = noteDuration.value
                #past_alter = noteDuration.alter
                step, octave, rootAlter = self.midinote2notename(noteDuration.value, noteDuration.alter)
                stem = self.stem(noteDuration.value)
                noteType, dot = self.noteType(time, division, noteDuration.n_beat) 
                tie = self.tie(midinote_post)

                note = Note(step=step, 
                    octave=octave, 
                    rootAlter=rootAlter, 
                    duration=noteDuration.n_beat,
                    dot=dot, 
                    tie=tie, 
                    tie2=None,
                    voice=1, 
                    type=noteType, 
                    stem=stem, 
                    beam=None
                )
            elif self.check_note_hold(noteDuration.value) and past_note_on is not None:
                step, octave, rootAlter = self.midinote2notename(past_note_on.value, past_note_on.alter)
                stem = self.stem(past_note_on.value)
                noteType, dot = self.noteType(time, division, noteDuration.n_beat) 
                tie =Const.tie.stop
                tie2 = None

                if self.check_note_on(past_note_on.value):
                    note = Note(step=step, 
                        octave=octave, 
                        rootAlter=rootAlter, 
                        duration=noteDuration.n_beat,
                        dot=dot, 
                        tie=tie,
                        tie2=tie2, 
                        voice=1, 
                        type=noteType, 
                        stem=stem, 
                        beam=None
                    )
                else:
                    note = Note(step=None, 
                        octave=None, 
                        rootAlter=None, 
                        duration=noteDuration.n_beat,
                        dot=dot, 
                        tie=tie, 
                        tie2=tie2, 
                        voice=1, 
                        type=noteType, 
                        stem=stem, 
                        beam=None
                    )
            else:
                """
                休符か、休符のHOLDか
                """
                #past_value = noteDuration.value
                past_note_on = noteDuration
                noteType, dot = self.noteType(time, division, noteDuration.n_beat) 


                note = Note(step=None, 
                    octave=None, 
                    rootAlter=None, 
                    duration=noteDuration.n_beat,
                    dot=dot, 
                    tie=None, 
                    tie2=None,
                    voice=1, 
                    type=noteType, 
                    stem=None, 
                    beam=None
                )

            notes.append([note,chord]) 

        self.fix_beam_quarter(time, division, notes)
        self.fix_beam_half(time, division, notes)
        self.remove_beam_begin_without_end(notes)
        self.remove_beam_begin_over_qurter(notes)
        self.add_tie2(notes, next_note)

        return notes, past_note_on

Notes = Notes()

