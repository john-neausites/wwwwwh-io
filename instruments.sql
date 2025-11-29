-- Insert instrument categories under Audio > Components > Instruments (id: 1171)
-- Level 5 categories for major instrument families

INSERT INTO menu_items (id, parent_id, name, slug, description, level, sort_order, is_active) VALUES
-- String Instruments
(11711, 1171, 'Strings', 'audio-components-instruments-strings', 'String instruments including bowed, plucked, and struck strings', 5, 1, 1),

-- Woodwind Instruments
(11712, 1171, 'Woodwinds', 'audio-components-instruments-woodwinds', 'Woodwind instruments including flutes, reeds, and other wind instruments', 5, 2, 1),

-- Brass Instruments
(11713, 1171, 'Brass', 'audio-components-instruments-brass', 'Brass instruments including trumpets, horns, and trombones', 5, 3, 1),

-- Percussion Instruments
(11714, 1171, 'Percussion', 'audio-components-instruments-percussion', 'Percussion instruments including drums, cymbals, and mallet instruments', 5, 4, 1),

-- Keyboard Instruments
(11715, 1171, 'Keyboards', 'audio-components-instruments-keyboards', 'Keyboard instruments including pianos, organs, and synthesizers', 5, 5, 1),

-- Electronic Instruments
(11716, 1171, 'Electronic', 'audio-components-instruments-electronic', 'Electronic instruments and synthesizers', 5, 6, 1),

-- World/Ethnic Instruments
(11717, 1171, 'World', 'audio-components-instruments-world', 'Traditional and ethnic instruments from around the world', 5, 7, 1);


-- Level 6: Specific instrument types under each family

-- Strings > Bowed
INSERT INTO menu_items (id, parent_id, name, slug, description, level, sort_order, is_active) VALUES
(117111, 11711, 'Violin', 'audio-components-instruments-strings-violin', 'Violin and violin family instruments', 6, 1, 1),
(117112, 11711, 'Viola', 'audio-components-instruments-strings-viola', 'Viola recordings and samples', 6, 2, 1),
(117113, 11711, 'Cello', 'audio-components-instruments-strings-cello', 'Cello and violoncello recordings', 6, 3, 1),
(117114, 11711, 'Double Bass', 'audio-components-instruments-strings-doublebass', 'Double bass and contrabass recordings', 6, 4, 1),

-- Strings > Plucked
(117115, 11711, 'Guitar', 'audio-components-instruments-strings-guitar', 'Acoustic and classical guitar', 6, 5, 1),
(117116, 11711, 'Electric Guitar', 'audio-components-instruments-strings-electricguitar', 'Electric guitar recordings and samples', 6, 6, 1),
(117117, 11711, 'Bass Guitar', 'audio-components-instruments-strings-bassguitar', 'Electric and acoustic bass guitar', 6, 7, 1),
(117118, 11711, 'Harp', 'audio-components-instruments-strings-harp', 'Harp and pedal harp recordings', 6, 8, 1),
(117119, 11711, 'Banjo', 'audio-components-instruments-strings-banjo', 'Banjo recordings and samples', 6, 9, 1),
(117120, 11711, 'Mandolin', 'audio-components-instruments-strings-mandolin', 'Mandolin recordings', 6, 10, 1),
(117121, 11711, 'Ukulele', 'audio-components-instruments-strings-ukulele', 'Ukulele recordings and samples', 6, 11, 1);

-- Woodwinds
INSERT INTO menu_items (id, parent_id, name, slug, description, level, sort_order, is_active) VALUES
(117122, 11712, 'Flute', 'audio-components-instruments-woodwinds-flute', 'Flute recordings and samples', 6, 1, 1),
(117123, 11712, 'Piccolo', 'audio-components-instruments-woodwinds-piccolo', 'Piccolo recordings', 6, 2, 1),
(117124, 11712, 'Clarinet', 'audio-components-instruments-woodwinds-clarinet', 'Clarinet recordings and samples', 6, 3, 1),
(117125, 11712, 'Oboe', 'audio-components-instruments-woodwinds-oboe', 'Oboe recordings', 6, 4, 1),
(117126, 11712, 'Bassoon', 'audio-components-instruments-woodwinds-bassoon', 'Bassoon recordings and samples', 6, 5, 1),
(117127, 11712, 'Saxophone', 'audio-components-instruments-woodwinds-saxophone', 'Saxophone family recordings', 6, 6, 1),
(117128, 11712, 'Recorder', 'audio-components-instruments-woodwinds-recorder', 'Recorder recordings', 6, 7, 1),
(117129, 11712, 'English Horn', 'audio-components-instruments-woodwinds-englishhorn', 'English horn recordings', 6, 8, 1);

-- Brass
INSERT INTO menu_items (id, parent_id, name, slug, description, level, sort_order, is_active) VALUES
(117131, 11713, 'Trumpet', 'audio-components-instruments-brass-trumpet', 'Trumpet recordings and samples', 6, 1, 1),
(117132, 11713, 'French Horn', 'audio-components-instruments-brass-frenchhorn', 'French horn recordings', 6, 2, 1),
(117133, 11713, 'Trombone', 'audio-components-instruments-brass-trombone', 'Trombone recordings and samples', 6, 3, 1),
(117134, 11713, 'Tuba', 'audio-components-instruments-brass-tuba', 'Tuba recordings', 6, 4, 1),
(117135, 11713, 'Cornet', 'audio-components-instruments-brass-cornet', 'Cornet recordings', 6, 5, 1),
(117136, 11713, 'Euphonium', 'audio-components-instruments-brass-euphonium', 'Euphonium recordings', 6, 6, 1),
(117137, 11713, 'Flugelhorn', 'audio-components-instruments-brass-flugelhorn', 'Flugelhorn recordings', 6, 7, 1);

-- Percussion
INSERT INTO menu_items (id, parent_id, name, slug, description, level, sort_order, is_active) VALUES
(117141, 11714, 'Drums', 'audio-components-instruments-percussion-drums', 'Drum kit and individual drums', 6, 1, 1),
(117142, 11714, 'Timpani', 'audio-components-instruments-percussion-timpani', 'Timpani recordings', 6, 2, 1),
(117143, 11714, 'Xylophone', 'audio-components-instruments-percussion-xylophone', 'Xylophone recordings', 6, 3, 1),
(117144, 11714, 'Marimba', 'audio-components-instruments-percussion-marimba', 'Marimba recordings and samples', 6, 4, 1),
(117145, 11714, 'Vibraphone', 'audio-components-instruments-percussion-vibraphone', 'Vibraphone recordings', 6, 5, 1),
(117146, 11714, 'Cymbals', 'audio-components-instruments-percussion-cymbals', 'Cymbals and crash recordings', 6, 6, 1),
(117147, 11714, 'Gong', 'audio-components-instruments-percussion-gong', 'Gong recordings', 6, 7, 1),
(117148, 11714, 'Triangle', 'audio-components-instruments-percussion-triangle', 'Triangle recordings', 6, 8, 1),
(117149, 11714, 'Tambourine', 'audio-components-instruments-percussion-tambourine', 'Tambourine recordings', 6, 9, 1),
(117150, 11714, 'Bongos', 'audio-components-instruments-percussion-bongos', 'Bongo drum recordings', 6, 10, 1),
(117151, 11714, 'Congas', 'audio-components-instruments-percussion-congas', 'Conga drum recordings', 6, 11, 1);

-- Keyboards
INSERT INTO menu_items (id, parent_id, name, slug, description, level, sort_order, is_active) VALUES
(117152, 11715, 'Piano', 'audio-components-instruments-keyboards-piano', 'Acoustic piano recordings', 6, 1, 1),
(117153, 11715, 'Electric Piano', 'audio-components-instruments-keyboards-electricpiano', 'Electric piano recordings', 6, 2, 1),
(117154, 11715, 'Organ', 'audio-components-instruments-keyboards-organ', 'Pipe and electronic organ', 6, 3, 1),
(117155, 11715, 'Harpsichord', 'audio-components-instruments-keyboards-harpsichord', 'Harpsichord recordings', 6, 4, 1),
(117156, 11715, 'Synthesizer', 'audio-components-instruments-keyboards-synthesizer', 'Analog and digital synthesizers', 6, 5, 1),
(117157, 11715, 'Accordion', 'audio-components-instruments-keyboards-accordion', 'Accordion recordings', 6, 6, 1),
(117158, 11715, 'Celesta', 'audio-components-instruments-keyboards-celesta', 'Celesta recordings', 6, 7, 1);

-- Electronic
INSERT INTO menu_items (id, parent_id, name, slug, description, level, sort_order, is_active) VALUES
(117161, 11716, 'Synthesizer', 'audio-components-instruments-electronic-synthesizer', 'Electronic synthesizer sounds', 6, 1, 1),
(117162, 11716, 'Drum Machine', 'audio-components-instruments-electronic-drummachine', 'Electronic drum machine sounds', 6, 2, 1),
(117163, 11716, 'Sampler', 'audio-components-instruments-electronic-sampler', 'Sample-based instruments', 6, 3, 1),
(117164, 11716, 'Theremin', 'audio-components-instruments-electronic-theremin', 'Theremin recordings', 6, 4, 1),
(117165, 11716, 'Vocoder', 'audio-components-instruments-electronic-vocoder', 'Vocoder recordings', 6, 5, 1);

-- World Instruments
INSERT INTO menu_items (id, parent_id, name, slug, description, level, sort_order, is_active) VALUES
(117171, 11717, 'Sitar', 'audio-components-instruments-world-sitar', 'Sitar recordings', 6, 1, 1),
(117172, 11717, 'Tabla', 'audio-components-instruments-world-tabla', 'Tabla drum recordings', 6, 2, 1),
(117173, 11717, 'Didgeridoo', 'audio-components-instruments-world-didgeridoo', 'Didgeridoo recordings', 6, 3, 1),
(117174, 11717, 'Bagpipes', 'audio-components-instruments-world-bagpipes', 'Bagpipe recordings', 6, 4, 1),
(117175, 11717, 'Shamisen', 'audio-components-instruments-world-shamisen', 'Shamisen recordings', 6, 5, 1),
(117176, 11717, 'Koto', 'audio-components-instruments-world-koto', 'Koto recordings', 6, 6, 1),
(117177, 11717, 'Erhu', 'audio-components-instruments-world-erhu', 'Erhu recordings', 6, 7, 1),
(117178, 11717, 'Shakuhachi', 'audio-components-instruments-world-shakuhachi', 'Shakuhachi flute recordings', 6, 8, 1),
(117179, 11717, 'Djembe', 'audio-components-instruments-world-djembe', 'Djembe drum recordings', 6, 9, 1),
(117180, 11717, 'Steel Drum', 'audio-components-instruments-world-steeldrum', 'Steel drum recordings', 6, 10, 1);
