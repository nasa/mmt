import parseCmrInstrumentsResponse from '../parseCmrInstrumentsResponse'

describe('cmrKeywords', () => {
  /**
   * Cat: [Earth Remote Sensing Instruments, In Situ/Laboratory Instruments]
   * Class: [Active Remote Sensing, Passive Remote Sensing, Chemical Meters/Analyzers]
   * Type: [Profilers/Sounders, Altimeters, Spectrometers/Radiometers]
   * Subtype: [Acoustic Sounders, Lidar/Laser Altimeters, Imaging Spectrometers/Radiometers]
   * short_name: [ACOUSTIC SOUNDERS, ATM, LVIS, SMAP L-BAND RADIOMETER, ADS]
   * long_name: [Airborne Topographic Mapper, Land, Vegetation, and Ice Sensor, SMAP L-Band Radiometer, Automated DNA Sequencer]
   */
  describe('can return a single list of keywords', () => {
    test('returns a parsed list of enums from CMR', () => {
      const cmrResponse = {
        category: [{
          value: 'NOT APPLICABLE',
          subfields: ['class'],
          class: [{
            value: 'NOT APPLICABLE',
            subfields: ['short_name'],
            short_name: [{
              value: 'NOT APPLICABLE',
              uuid: '51963b3c-d82e-441f-8f65-e21b005861ef'
            }]
          }]
        }, {
          value: 'Earth Remote Sensing Instruments',
          subfields: ['class'],
          class: [{
            value: 'Active Remote Sensing',
            subfields: ['type'],
            type: [{
              value: 'Profilers/Sounders',
              subfields: ['subtype'],
              subtype: [{
                value: 'Acoustic Sounders',
                subfields: ['short_name'],
                short_name: [{
                  value: 'ACOUSTIC SOUNDERS',
                  uuid: '7ef0c3e6-1012-411a-b166-482fb35bb1dd'
                }]
              }]
            }, {
              value: 'Altimeters',
              subfields: ['subtype'],
              subtype: [{
                value: 'Lidar/Laser Altimeters',
                subfields: ['short_name'],
                short_name: [{
                  value: 'ATM',
                  subfields: ['long_name'],
                  long_name: [{
                    value: 'Airborne Topographic Mapper',
                    uuid: 'c2428a35-a87c-4ec7-aefd-13ff410b3271'
                  }]
                }, {
                  value: 'LVIS',
                  subfields: ['long_name'],
                  long_name: [{
                    value: 'Land, Vegetation, and Ice Sensor',
                    uuid: 'aa338429-35e6-4ee2-821f-0eac81802689'
                  }]
                }]
              }]
            }]
          }, {
            value: 'Passive Remote Sensing',
            subfields: ['type'],
            type: [{
              value: 'Spectrometers/Radiometers',
              subfields: ['subtype'],
              subtype: [{
                value: 'Imaging Spectrometers/Radiometers',
                subfields: ['short_name'],
                short_name: [{
                  value: 'SMAP L-BAND RADIOMETER',
                  subfields: ['long_name'],
                  long_name: [{
                    value: 'SMAP L-Band Radiometer',
                    uuid: 'fee5e9e1-10f1-4f14-94bc-c287f8e2c209'
                  }]
                }]
              }]
            }]
          }]
        }, {
          value: 'In Situ/Laboratory Instruments',
          subfields: ['class'],
          class: [{
            value: 'Chemical Meters/Analyzers',
            subfields: ['short_name'],
            short_name: [{
              value: 'ADS',
              subfields: ['long_name'],
              long_name: [{
                value: 'Automated DNA Sequencer',
                uuid: '554a3c73-3b48-43ea-bf5b-8b98bc2b11bc'
              }]
            }]
          }]
        }]
      }

      const expectedResult = [
        {
          category: 'Earth Remote Sensing Instruments',
          class: 'Active Remote Sensing',
          type: 'Altimeters',
          subtype: 'Lidar/Laser Altimeters',
          short_name: 'ATM',
          long_name: 'Airborne Topographic Mapper'
        },
        {
          category: 'Earth Remote Sensing Instruments',
          class: 'Active Remote Sensing',
          type: 'Altimeters',
          subtype: 'Lidar/Laser Altimeters',
          short_name: 'LVIS',
          long_name: 'Land, Vegetation, and Ice Sensor'
        },
        {
          category: 'Earth Remote Sensing Instruments',
          class: 'Active Remote Sensing',
          type: 'Profilers/Sounders',
          subtype: 'Acoustic Sounders',
          short_name: 'ACOUSTIC SOUNDERS'
        },
        {
          category: 'Earth Remote Sensing Instruments',
          class: 'Passive Remote Sensing',
          type: 'Spectrometers/Radiometers',
          subtype: 'Imaging Spectrometers/Radiometers',
          short_name: 'SMAP L-BAND RADIOMETER',
          long_name: 'SMAP L-Band Radiometer'
        },
        {
          category: 'In Situ/Laboratory Instruments',
          class: 'Chemical Meters/Analyzers',
          short_name: 'ADS',
          long_name: 'Automated DNA Sequencer'
        },
        {
          category: 'NOT APPLICABLE',
          class: 'NOT APPLICABLE',
          short_name: 'NOT APPLICABLE'
        }
      ]
      const result = parseCmrInstrumentsResponse(cmrResponse, ['category', 'class', 'type', 'subtype', 'short_name', 'long_name'])

      expect(result).toEqual(expectedResult)
    })
  })
})
