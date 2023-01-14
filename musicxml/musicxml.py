# -*- coding: utf-8 -*-
from datetime import datetime
import pytz
from jinja2 import Template, Environment, FileSystemLoader
import json
from musicxml.template import Const, Measure, ScoreInstrument, ScorePart, Part, SongInfomation, Time, Clef, Note, Harmony
from musicxml.notes import  Notes
from musicxml.common import Common as MXMLFunction
from common.const import Const as ScoreConst
from common.common import Common as ScoreFunction


class Musicxml:            
    def __init__(self):
        self.melody = Const.partMelody
        self.env = Environment(loader=FileSystemLoader('./musicxml/templates', encoding='utf8'))
        self.template_xml = self.env.get_template('default.xml')
        self.clef_to = Clef("G",2)


    def final(self, score, outpath):
        title = "This is title"
        encoding_date =datetime.now(pytz.timezone('Asia/Tokyo')).strftime("%Y-%m-%d")

        part = Part(self.melody.part_id)

        bar_id = 0
        first_measure_post_rehearsalLetter = None
        for line in score:
            rehearsalLetter = line["Rehearsal-Letter"]
            bars_chord = line["chords"]
            bars_melody = line["melody"]


            print("REHEASAL MARK : ", rehearsalLetter)
            past_note_on = None
            for id_ in range(len(bars_melody)):
                print("BAR NUM : ", id_)
                bar_id += 1
                bar_chord = bars_chord[id_]
                bar_melody = bars_melody[id_]
                time_ = MXMLFunction.timeSignature(bar_melody["time-signature"])
                keyfifths = MXMLFunction.keyFifths(bar_melody["key"])
                division = bar_melody["division"]
                accidentalNotation = MXMLFunction.accidentalNotation(keyfifths)
                attribute_division = MXMLFunction.get_attribute_division(time_, division)

                if id_ + 1 < len(bars_melody):
                    firstMidiNote_postMeaure =  bars_melody[id_ + 1]["content"][0] 
                
                else:
                    firstMidiNote_postMeaure = -2

                notes, past_note_on = Notes.final(time_, division, accidentalNotation, bar_melody["content"], bar_chord, past_note_on, firstMidiNote_postMeaure)

                m = Measure(bar_id)
                if id_ == 0:
                    m.set_new_system()
                    m.update_direction(rehearsalLetter)
                    m.update_attributes(
                        attribute_division,
                        keyfifths,
                        time_,
                        self.clef_to
                    )

                    if  first_measure_post_rehearsalLetter is not None :
                        print(first_measure_post_rehearsalLetter.attributes, m.attributes)
                        if  MXMLFunction.is_equal_attribute(first_measure_post_rehearsalLetter.attributes, m.attributes):
                            m.delete_attributes()

                    first_measure_post_rehearsalLetter = Measure(bar_id)
                    first_measure_post_rehearsalLetter.update_attributes(
                        attribute_division,
                        keyfifths,
                        time_,
                        self.clef_to
                    )

                elif id_ == len(bars_melody) - 1:
                    m.update_barline(Const.barStyle.lightLight)


                m.update_notes(notes)
                part.append(m)
                

        #最後の小節の処理
        m.update_barline(Const.barStyle.lightHeavy)



        # XML INFORMATION
        songInformation = SongInfomation(encoding_date,  title)
        scorePart = ScorePart(self.melody.name, self.melody.abbrevation, self.melody.part_id)
        scorePart.update_scoreInstrument(self.melody.instrument_id, self.melody.instrument_name, self.melody.midi_channel)
        scoreParts = [scorePart]

        score_xml = self.template_xml.render(
            songInformation=songInformation,
            scoreParts=scoreParts,
            parts=[part]
            )
        
        
        f = open(outpath, 'w')
        f.write(score_xml)
        f.close()
        return score_xml

Musicxml = Musicxml()

if __name__ == "__main__":
    mxml =  Musicxml()
    mxml.test_load()