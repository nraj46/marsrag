// MarsRAG knowledge base — curated NASA-style research reports.
// Each document is split into titled sections; sections become retrieval chunks.

export interface DocSection {
  heading: string;
  body: string;
}

export interface MarsDocument {
  id: string;
  title: string;
  source: string;
  year: number;
  topic: string;
  sections: DocSection[];
}

export const DOCUMENTS: MarsDocument[] = [
  {
    id: "olympus-mons",
    title: "Olympus Mons: Geology of the Solar System's Largest Volcano",
    source: "NASA / JPL Technical Report",
    year: 2023,
    topic: "Geology",
    sections: [
      {
        heading: "Dimensions and structure",
        body: "Olympus Mons is a shield volcano in the Tharsis region of Mars, standing approximately 21.9 km above the datum — nearly three times the height of Mount Everest above sea level — and spanning about 600 km in diameter, roughly the size of Arizona. Its summit caldera is a complex of overlapping pit craters about 80 km wide and up to 3 km deep. The volcano's extremely shallow slopes, averaging about 5 degrees, are characteristic of basaltic lava flows that travelled long distances before solidifying. A prominent escarpment, in places up to 8 km high, rings the base and is interpreted as evidence of erosion by an ancient northern ocean or by glacial processes.",
      },
      {
        heading: "Age and formation history",
        body: "Crater counting on Olympus Mons lava flows yields surprisingly young ages: some flows are dated to only about 2 to 200 million years old, indicating the volcano may have been active in the geologically recent past and could still be dormant rather than extinct. The volcano grew to its enormous size because Mars lacks plate tectonics, so a mantle hotspot remained under one spot for billions of years, stacking lava flows in a single location. Low Martian gravity (3.71 m/s²) also allowed the edifice to grow taller before its own weight caused collapse. Lava channels and leveed flows on the flanks record effusion rates comparable to those of Hawaii's Kilauea volcano.",
      },
      {
        heading: "Atmospheric and exploration significance",
        body: "The summit of Olympus Mons rises so high that atmospheric pressure there is about 72 pascals, roughly 12 percent of the Martian mean — the peak effectively protrudes into near-vacuum conditions and often pokes above regional dust haze, which is why early telescopic observers saw it as a bright spot they named Nix Olympica, the Snows of Olympus. For exploration planning, the young lava flows and possible lava tubes on the flanks are of interest as radiation-shielded habitats, and the volcano's mineralogy constrains models of the Martian mantle. Orbiters have imaged clouds of water ice forming over the summit during afternoon heating, including the elongated Arsia Mons-style orographic cloud phenomena seen across the Tharsis volcanoes.",
      },
    ],
  },
  {
    id: "gale-crater",
    title: "Aqueous History of Gale Crater: Evidence for a Long-Lived Lake System",
    source: "Mars Science Laboratory (Curiosity) Science Team",
    year: 2022,
    topic: "Water & Habitability",
    sections: [
      {
        heading: "Lake deposits in Yellowknife Bay",
        body: "Within its first year of operations, the Curiosity rover found definitive evidence of an ancient freshwater lake in Yellowknife Bay, Gale Crater. The fine-grained mudstone of the Sheepbed unit settled from quiet water, and its chemistry — neutral pH, low salinity, and the presence of sulfur, nitrogen, hydrogen, oxygen, carbon and phosphorus — offered all the key ingredients for microbial life. Radiometric and exposure dating suggests the lake existed roughly 3.6 billion years ago and persisted for at least hundreds to tens of thousands of years. Curiosity measured a radiation dose at the surface of about 0.67 millisieverts per day, an important benchmark for human mission planning derived from the same landing site.",
      },
      {
        heading: "Mount Sharp stratigraphy and climate change",
        body: "The layered sediments of Mount Sharp (Aeolis Mons), the 5.5 km-high mound at Gale's center, record a long transition in Mars climate. Lower strata are dominated by lake and river deposits of the Murray formation, showing that streams repeatedly refilled a crater lake over millions of years. Higher up, the sulfate-bearing unit signals a shift to a drier climate in which evaporating water left behind calcium and magnesium sulfates — Curiosity found calcium sulfate veins, including nearly pure gypsum, throughout the traverse. Ripple marks, cross-bedded sandstones and conglomerates with rounded pebbles demonstrate flowing surface water with depths from ankle to hip deep in ancient streambeds.",
      },
      {
        heading: "Organic molecules and habitability",
        body: "Curiosity's SAM instrument detected preserved organic molecules, including thiophenes, benzene, toluene and small carbon chains such as propane, in 3-billion-year-old mudstones — organics that survived despite surface radiation, likely protected within sediments and released by heating to about 500 °C during analysis. SAM also measured seasonal variation in atmospheric methane, which rises from a background of about 0.4 parts per billion to peaks near 7 ppb in summer, a still-unexplained signal that could have geological or biological origins. Together with the detection of boron in veins — an element that stabilizes ribose in RNA-forming chemistry — the Gale record makes the crater one of the strongest case studies that early Mars was habitable.",
      },
    ],
  },
  {
    id: "moxie",
    title: "MOXIE: In-Situ Oxygen Production on Mars — Final Experiment Report",
    source: "NASA ISRU Program / Mars 2020",
    year: 2024,
    topic: "ISRU & Propulsion",
    sections: [
      {
        heading: "Experiment overview and results",
        body: "The Mars Oxygen In-Situ Resource Utilization Experiment (MOXIE), a toaster-sized device aboard the Perseverance rover, demonstrated producing oxygen from the Martian atmosphere for the first time on another world. Over 16 runs between April 2021 and September 2023, MOXIE produced a total of 122 grams of oxygen at purity of 98 percent or better, roughly double its original goal. Its best production rate reached 12 grams per hour — about what a small dog breathes — at energy costs far above a full-scale plant but proving the solid-oxide electrolysis process works in real Martian conditions across seasons, day and night, and dust-loading variations.",
      },
      {
        heading: "How solid-oxide electrolysis works",
        body: "MOXIE draws in Martian air — 95.3 percent carbon dioxide, 2.7 percent nitrogen, 1.6 percent argon — through a HEPA filter, compresses it with a scroll pump, and heats it to about 800 °C. In the solid-oxide electrolysis stack, an electric current splits CO₂ into carbon monoxide and oxygen ions, which migrate through a scandia-stabilized zirconia electrolyte and recombine as O₂ on the anode side. A sensor measures purity in real time and excess gas is vented. The process must reject the toxic carbon monoxide byproduct safely, and the nickel-based electrodes must resist carbon deposition (coking), a key degradation mode tracked across the 16 runs.",
      },
      {
        heading: "Scaling to human missions",
        body: "A human mission needs vastly more oxygen than MOXIE produced: roughly 25 to 30 tonnes of liquid oxygen as propellant oxidizer to lift a Mars Ascent Vehicle, plus about 0.8 kg per person per day for breathing. Engineers estimate a full-scale plant must run about 200 to 300 times MOXIE's rate — producing 2 to 3 kg of oxygen per hour, operating continuously for over a year before the crew arrives, and drawing around 25 to 30 kW of power, likely from a fission surface power system. Because shipping 30 tonnes of oxygen from Earth is prohibitively expensive, in-situ production is considered an enabling technology: every kilogram made on Mars is a kilogram that does not need to be landed.",
      },
    ],
  },
  {
    id: "radiation",
    title: "Radiation Shielding Strategies for Crewed Mars Surface Habitats",
    source: "NASA Human Research Program",
    year: 2025,
    topic: "Crew Health",
    sections: [
      {
        heading: "The Martian radiation environment",
        body: "Unlike Earth, Mars has no global magnetosphere and only a thin atmosphere (about 1 percent of Earth's sea-level pressure), so the surface is exposed to galactic cosmic rays (GCR) and solar particle events (SPE). The Curiosity rover's RAD instrument measured an absorbed dose rate of roughly 0.21 milligray per day and a dose equivalent of about 0.67 millisievert per day on the surface; a 500-day surface stay plus two 180-day transits could therefore approach or exceed 1 sievert of total mission exposure, above NASA's career limits for some astronauts. GCR heavy ions are the dominant long-term cancer risk, while a large solar storm can deliver an acute dose in hours, requiring a quickly reachable storm shelter.",
      },
      {
        heading: "Shielding materials and trade-offs",
        body: "Hydrogen-rich materials shield best per kilogram because hydrogen nuclei efficiently fragment incoming heavy ions without creating heavy secondary particles: polyethylene, water, and even stored food and waste outperform aluminium, which can worsen dose through secondary radiation. Studies referenced by the Human Research Program show that about 20 to 30 g/cm² of polyethylene meaningfully reduces SPE dose, but GCR dose is stubborn — shielding beyond roughly 30 g/cm² yields diminishing returns and can even plateau because of secondary neutron production. This is why mission designers combine modest material shielding with operational measures: scheduling EVAs around solar weather, using rover-mounted detectors, and keeping sleep quarters in the best-shielded part of the habitat to cut chronic exposure by up to a third.",
      },
      {
        heading: "Regolith shielding and lava tubes",
        body: "The most mass-efficient shield on Mars is Mars itself: covering a habitat with 2 to 3 metres of regolith reduces surface dose to near-terrestrial background levels, according to radiation transport simulations validated against RAD data. Robotic precursor missions could pile regolith over inflatable habitats before crew arrival, and 3-D-printed regolith structures are under study for the same purpose. Natural lava tubes — imaged by orbiters as skylight pits, including candidate caves near Arsia Mons and in Hellas Planitia — offer tens of metres of rock overhead, stable temperatures near −20 °C, and protection from micrometeorites and dust, making them leading candidates for long-duration outposts pending robotic reconnaissance of their interiors.",
      },
    ],
  },
  {
    id: "dust-storms",
    title: "Global Dust Storms: Dynamics, Forecasting, and Operational Impacts",
    source: "Mars Climate Modeling Center",
    year: 2023,
    topic: "Atmosphere & Weather",
    sections: [
      {
        heading: "How planet-encircling storms form",
        body: "Regional dust storms occur every Martian year, mainly in southern spring and summer when Mars is near perihelion, but roughly once every three Mars years (about 5.5 Earth years) a storm grows to encircle the entire planet. Dust lifted to altitudes of 40 to 80 km absorbs sunlight, heating the atmosphere and strengthening the winds that lift more dust — a positive feedback that can wrap the planet in haze within weeks. Atmospheric opacity, measured as tau, exceeded 10.8 at Gale Crater during the 2018 global storm, cutting surface sunlight to twilight levels. The 2018 event ended the Opportunity rover's mission after nearly 15 years when its solar arrays could no longer charge its batteries.",
      },
      {
        heading: "Forecasting with orbiters and models",
        body: "Forecasters combine daily global imaging from the Mars Color Imager (MARCI) aboard Mars Reconnaissance Orbiter with data assimilation into global climate models such as NASA's Mars Global Climate Model and the Mars Weather Research and Forecasting model. Dust lifting is dominated by wind-stress lifting and dust devils; Mars experiences dust devils up to 8 km tall, far taller than terrestrial ones, and their tracks are visible across the surface. Forecast skill is currently measured in sols rather than weeks for storm onset, so surface mission rules remain conservative: assets are put into low-power safe modes when modeled tau at the site is projected above threshold values. Improving onset prediction is an active research goal ahead of crewed landings, where storms affect abort windows and power budgets.",
      },
      {
        heading: "Impacts on surface operations and hardware",
        body: "Even outside global storms, airborne dust degrades operations: it coats solar panels (cleaning events from wind gusts periodically restored power on the Spirit and Opportunity rovers), abrades spacesuit seals and bearings, infiltrates habitats, and carries toxic perchlorates. Electrostatic charging of dust during storms is a concern for electronics and EVA suits. Solar-powered assets are most vulnerable — InSight's lander ultimately succumbed in December 2022 to dust accumulation on its panels after registering a gradual tau-driven power decline — which is why crewed mission architectures favor fission surface power of about 40 kW that is independent of sunlight, plus dust-mitigation coatings such as the electrodynamic dust shield tested by NASA for lunar and Martian use.",
      },
    ],
  },
  {
    id: "edl",
    title: "Entry, Descent, and Landing for Heavy Mars Payloads",
    source: "NASA EDL Systems Office",
    year: 2024,
    topic: "Landing Systems",
    sections: [
      {
        heading: "The seven minutes of terror",
        body: "A Mars lander hits the top of the atmosphere at up to about 5.9 km/s (roughly 21,000 km/h for Mars 2020) carrying kinetic energy that must be dissipated in about seven minutes — with no possibility of real-time control from Earth because one-way radio delay is 3 to 22 minutes. The heat shield endures peak heating near 2,100 °C while the capsule decelerates to about Mach 2, at which point a supersonic parachute deploys; Mars 2020 used the strongest parachute ever flown, 21.5 m in diameter, qualified to open at up to Mach 2.2. A radar and Terrain Relative Navigation system then steer the descent stage to a safe spot within the landing ellipse, correcting for hazards mapped from orbit.",
      },
      {
        heading: "Sky crane and powered descent",
        body: "For Curiosity and Perseverance, a rocket-powered descent stage lowered the rover on a 7.6-metre bridle in the 'sky crane' maneuver, keeping plume impingement off the rover and allowing touchdown velocities below 0.75 m/s. The descent stage then flew away to crash at a safe distance. Powered descent engines throttle deeply — the Mars Science Laboratory descent engines operated from about 400 to 3,100 newtons — and must avoid excavating the surface or blasting the landing site with ejecta. The same terminal descent problem scales badly for human missions: landing 20 to 40 tonnes will require supersonic retropropulsion starting at Mach 2 to 3 and multiple engines, because parachutes cannot decelerate such masses in Mars's thin air.",
      },
      {
        heading: "Mass limits of current technology",
        body: "The heaviest payload landed on Mars to date is Perseverance at about 1,025 kg — close to the practical ceiling of the Viking-heritage EDL architecture of about 1 tonne. NASA studies of the Hypersonic Inflatable Aerodynamic Decelerator (HIAD) and the LOFTID flight demonstration, which splashed down in November 2022 after inflating to 6 metres, show inflatable aeroshells can increase drag area without growing the launch fairing, potentially landing several tonnes. Combined with mid-lift-to-drag vehicles that fly a guided entry to bleed energy over a longer path, these technologies form the roadmap toward cargo landings in the 5 to 20 tonne class that a crewed campaign requires, though none has yet flown at Mars.",
      },
    ],
  },
  {
    id: "sample-caching",
    title: "Perseverance Sample Caching: Tube Integrity and Depot Strategy",
    source: "Mars 2020 Project Office",
    year: 2023,
    topic: "Sample Return",
    sections: [
      {
        heading: "The caching system",
        body: "Perseverance carries 43 sample tubes (38 for samples plus 5 witness tubes) made of titanium coated with aluminum, each designed to hermetically seal a rock core about the size of a piece of chalk — roughly 13 mm in diameter and up to 60 mm long, holding about 10 to 15 grams of material. The Sampling and Caching System is one of the most complex mechanisms ever flown: a 2.1-metre robotic arm drills cores, and an adaptive caching assembly inside the rover body inspects, photographs, volume-measures, seals and stores each tube. Each sample is documented with image context from the rover's cameras and the exact collection location, so scientists on Earth can later interpret the returned material in its geological setting.",
      },
      {
        heading: "The Three Forks depot",
        body: "Between December 21, 2022 and January 28, 2023, Perseverance built the first sample depot on another planet at Three Forks in Jezero Crater, dropping 10 tubes — 8 rock samples, 1 atmospheric sample and 1 witness tube — onto the surface in a mapped pattern. The depot is a backup: if Perseverance cannot later deliver its onboard tubes to a sample return lander, a recovery mission with two helicopters could collect the depot tubes instead. The backup tubes must survive years of ultraviolet radiation, thermal cycling between roughly −70 °C at night and −14 °C daytime highs at the site, dust accumulation and possible frost, so tube seals were qualified against leakage under these conditions for at least a decade.",
      },
      {
        heading: "Why these samples matter",
        body: "The cached samples span Jezero's geological diversity: igneous rocks from the crater floor (Séítah and Máaz formations), sedimentary rocks from the ancient river delta front that are the most likely to preserve biosignatures, and a tube of Martian atmosphere. The delta samples are the prize — on Earth, deltaic sediments concentrate and preserve organic matter, and Perseverance's SHERLOC instrument has detected organic molecules associated with minerals in the delta rocks. Returning the tubes to Earth laboratories, where instruments far too sensitive and large to fly can measure isotopic ratios and organic chemistry at parts-per-billion levels, remains the only near-term way to test whether the organics are biological in origin.",
      },
    ],
  },
  {
    id: "ingenuity",
    title: "Ingenuity Mars Helicopter: Flight Performance in a Thin Atmosphere",
    source: "JPL Rotorcraft Team",
    year: 2024,
    topic: "Aerial Mobility",
    sections: [
      {
        heading: "Designing for 1 percent atmosphere",
        body: "Ingenuity, a 1.8 kg technology demonstration carried to Mars under Perseverance's belly pan, was engineered to fly in an atmosphere only about 1 percent as dense as Earth's — equivalent to flying at over 30 km altitude on Earth. Its counter-rotating coaxial rotors span 1.2 metres and spin at 2,400 to 2,900 rpm, five to ten times faster than a terrestrial helicopter of similar size, to generate enough lift. The helicopter survived frigid nights down to −90 °C with only about 350 watts of heating power drawn from its six lithium-ion cells, most of its energy budget going to staying warm rather than flying. Its brain was a Qualcomm Snapdragon 801 processor — more computing power than all previous NASA rovers combined.",
      },
      {
        heading: "Flight record: 5 planned, 72 flown",
        body: "Ingenuity was designed for up to 5 flights in 30 days. It ultimately flew 72 times over nearly three years (April 2021 to January 2024), accumulating over two hours of flight time, travelling about 17 km, reaching a top speed of 10 m/s (36 km/h) and a record altitude of 24 metres. After its demonstration phase it served as an aerial scout for Perseverance, photographing terrain the rover would later traverse in Jezero Crater and in the upper delta. The mission ended after Flight 72 on January 18, 2024, when rotor blade damage sustained during a hard landing — likely contact with the rippled sandy surface of Neretva Vallis — left it unable to fly, though it continued returning data as a stationary weather and communications testbed.",
      },
      {
        heading: "Legacy: the next generation of Mars aircraft",
        body: "Ingenuity proved aerial mobility at Mars and directly shaped follow-on concepts. Two Sample Recovery Helicopters, derived from Ingenuity with larger rotors, wheels and a small robotic arm, were designed to retrieve sample tubes from the Three Forks depot. The proposed Mars Science Helicopter would carry roughly 5 kg of instruments with six rotors, and concepts such as the 1,300 kg Dragonfly-style rotorcraft studied for Mars aim at regional exploration hundreds of kilometres from a landing site. Key engineering lessons include autonomous hazard avoidance with a downward navigation camera at 13 frames per second, tolerance of communication dropouts through the Perseverance base station, and flight software updates delivered across interplanetary distances — demonstrated when the team uploaded new navigation capabilities mid-mission.",
      },
    ],
  },
  {
    id: "subsurface-ice",
    title: "Subsurface Ice Mapping: SHARAD and Orbital Observations of Buried Water",
    source: "Mars Reconnaissance Orbiter Science Team",
    year: 2022,
    topic: "Water & Resources",
    sections: [
      {
        heading: "Radar sounding of buried glaciers",
        body: "The Shallow Radar (SHARAD) instrument aboard Mars Reconnaissance Orbiter transmits 15–25 MHz radio pulses that penetrate the Martian subsurface, imaging buried structures to depths of about 1 km with vertical resolution near 15 metres. SHARAD has confirmed that lobate debris aprons in the mid-latitudes are debris-covered glaciers of nearly pure water ice, tens to hundreds of metres thick, left from past ice ages when Mars's axial tilt (obliquity) was much larger and ice migrated from the poles toward the equator. In Utopia Planitia, SHARAD measurements indicate a frozen ice deposit larger in area than Lake Superior, 80 to 170 metres thick, estimated to hold as much water as Lake Superior itself.",
      },
      {
        heading: "Shallow ice exposed by impacts and the Phoenix lander",
        body: "Fresh impact craters at mid and high latitudes repeatedly excavate bright water ice that sublimates away over weeks, proving ice lies within a metre of the surface across broad regions. In 2008 the Phoenix lander scraped trench floors in the northern plains (68.2° N) to expose a hard icy layer just 5 to 18 cm below the surface, and its cameras watched dice-sized chunks of exposed ice sublimate over four sols. Orbital neutron and gamma-ray spectrometers (Mars Odyssey GRS) map hydrogen in the top metre globally, showing that poleward of roughly ±55° latitude the soil is ice-saturated, while some equatorial and mid-latitude deposits — such as those in Medusae Fossae — may be deeply buried ice or ice-rich sediments.",
      },
      {
        heading: "Ice as a mission resource (SWIM mapping)",
        body: "The Subsurface Water Ice Mapping (SWIM) project combines radar, thermal, neutron and image data to pinpoint where ice is within the top few metres in the northern mid-latitudes — the band between about 35° and 55° N favored for human landing sites, low enough for warmth and sunlight yet ice-bearing. Ice accessible at depths under 1 metre can be mined with simple excavation rather than drilling and is feedstock for drinking water, radiation-shielding berms, and — via electrolysis and the Sabatier reaction — methane/oxygen rocket propellant. Landing-site studies prioritize these ice-rich plains, and the Arcadia Planitia region, where terraced craters suggest ice layers 20 to 40 metres deep, is a leading candidate zone for a crewed base.",
      },
    ],
  },
  {
    id: "life-support",
    title: "Closed-Loop Life Support: Water and Oxygen Recycling for Mars Missions",
    source: "NASA ECLSS Program",
    year: 2025,
    topic: "Crew Systems",
    sections: [
      {
        heading: "Water recovery on the ISS as the baseline",
        body: "The International Space Station's Environmental Control and Life Support System (ECLSS) is the testbed for Mars life support. Its Water Recovery System processes urine, condensate and hygiene water through distillation and catalytic oxidation; with the 2023 upgrade of the Urine Processor Assembly and brine processing, total water recovery reached about 98 percent — the figure NASA targets for Mars, where resupply is impossible. Losses matter enormously: a crew of four uses roughly 11,000 kg of water over a 500-day surface stay if unrecycled, versus a few hundred kilograms of makeup water at 98 percent closure. Every percentage point of closure below 98 percent adds tonnes of launch mass.",
      },
      {
        heading: "Oxygen generation and CO₂ reduction",
        body: "The station's Oxygen Generation System electrolyzes water to produce oxygen, and a Sabatier reactor combines the hydrogen byproduct with exhaled carbon dioxide to make water and methane — closing much of the oxygen loop. A crew member consumes about 0.84 kg of oxygen and produces about 1.0 kg of CO₂ per day, so a four-person Mars crew needs about 3.4 kg of O₂ daily. For Mars surface operations, designers intend to supplement electrolysis with in-situ production (MOXIE-derived plants) and buffer CO₂ removal with both regenerative sorbent beds and, in greenhouse concepts, plant photosynthesis, though plants are not counted on as primary life support in current reference missions.",
      },
      {
        heading: "Reliability and repair for a 3-year mission",
        body: "A Mars mission cannot be resupplied and cannot abort quickly: the transit and surface phases total roughly 30 months, so ECLSS hardware must run for years with failures repaired by the crew using onboard spares and 3-D-printed parts. ISS experience drives this design philosophy — the station's oxygen generator and urine processor have each failed and been repaired in orbit multiple times, and mean-time-between-failure data from those events set sparing levels for Mars. NASA's roadmap therefore demands graceful degradation (no single failure loses the crew), in-space manufacturable spares, and autonomous fault detection, since ground controllers face up to 22 minutes of signal delay and cannot joystick repairs.",
      },
    ],
  },
  {
    id: "comm-delay",
    title: "Communications with Mars: Light-Time Delay and Autonomous Operations",
    source: "NASA Deep Space Network",
    year: 2023,
    topic: "Communications",
    sections: [
      {
        heading: "The physics of the delay",
        body: "Radio and laser signals travel at the speed of light, but Mars is far: the Earth–Mars distance varies from about 55 million km at opposition to about 401 million km near conjunction, giving one-way light time of roughly 3 minutes at closest approach and up to about 22 minutes at the far end. Round-trip delay therefore ranges from about 6 to 44 minutes. Around solar conjunction, which occurs every 26 months and lasts about two weeks, the Sun's corona corrupts signals so severely that missions impose a communications moratorium, sending only minimal housekeeping beeps and pre-loaded command sequences. No real-time control of any Mars asset is possible; even 'driving' a rover means sending a full sol's plan and waiting for confirmation the next day.",
      },
      {
        heading: "Deep Space Network and relay orbiters",
        body: "NASA's Deep Space Network (DSN) — three complexes in Goldstone (California), Madrid (Spain) and Canberra (Australia), each with 34-metre antennas and one 70-metre antenna — provides the only continuous link to Mars. Most rover data, however, arrives via relay orbiters (Mars Reconnaissance Orbiter and Mars Odyssey, joined periodically by ESA's Trace Gas Orbiter), because a direct-to-Earth rover link is limited to a few hundred bits per second while an orbiter pass at UHF can return megabits — MRO has relayed more science data than all other interplanetary missions combined, over 450 terabits. Relay passes last only about 8 to 15 minutes, twice per sol, so surface mission planning is built around these communication windows.",
      },
      {
        heading: "Autonomy and optical communications",
        body: "Delay forces autonomy: Perseverance's AutoNav lets it drive up to about 120 metres per hour making its own hazard decisions, versus a few metres per hour under ground-in-the-loop driving, and future missions add onboard science analysis to prioritize what little bandwidth exists. NASA's Deep Space Optical Communications (DSOC) experiment aboard Psyche demonstrated laser links at up to 267 megabits per second from beyond Mars-range distances — 10 to 100 times radio data rates — including streaming an ultra-high-definition video from 31 million km in December 2023 and a link from about 390 million km. Operational optical terminals at Mars could raise returned science volume by an order of magnitude and enable live video for crewed missions.",
      },
    ],
  },
  {
    id: "regolith-ag",
    title: "Regolith Agriculture: Growing Crops in Martian Soil Simulants",
    source: "NASA Kennedy Space Center — Veggie / Advanced Plant Habitat Program",
    year: 2024,
    topic: "Food Systems",
    sections: [
      {
        heading: "Simulant experiments and what actually grows",
        body: "Dutch researchers at Wageningen University grew ten crop species in Mars regolith simulant (MMS, made from Hawaiian volcanic ash), lunar simulant and Earth potting soil: the Mars simulant supported germination and growth comparable to potting soil for most species, and second-generation seeds from rye, cress and rocket grown in Mars simulant proved viable — a critical proof that a Martian garden can reproduce itself. Experiments at Kennedy Space Center with the more chemically faithful JSC Mars-1A and MGS-1 simulants show leafy greens (lettuce, mizuna), radishes, peas, quinoa and tomatoes growing when the simulant is amended with organic matter, though yields trail hydroponic controls by roughly 20 to 40 percent depending on species.",
      },
      {
        heading: "The perchlorate problem",
        body: "Real Martian regolith contains roughly 0.5 to 1 percent calcium and magnesium perchlorates — chemicals that are toxic to human thyroid function and damaging to plants. Perchlorates were measured directly by the Phoenix lander's wet chemistry lab in 2008 and complicate every agriculture and ISRU plan that touches raw soil. Mitigations include washing regolith with water (expensive in a closed habitat), thermal decomposition at several hundred degrees, and bioremediation with perchlorate-reducing bacteria, which conveniently also release oxygen as a byproduct. Interestingly, perchlorates also depress the freezing point of water to as low as −70 °C in brines, one reason researchers take transient liquid brines on modern Mars seriously.",
      },
      {
        heading: "Why grow food on Mars at all",
        body: "A crew of four on a 500-day surface mission needs roughly 1.8 to 2.5 kg of food per person per day including packaging — about 4 to 5 tonnes total — which can be shipped from Earth, but fresh crops add nutrition that degrades in storage (vitamin C losses reach 30 to 50 percent over multi-year storage), recycle CO₂ and water, and provide documented psychological benefit to crews. Studies for NASA estimate a bioregenerative system supplying about 50 percent of crew calories needs roughly 100 to 200 m² of growing area under high-intensity LED lighting and about 40 to 90 kW of power, so near-term architectures treat farming as a supplement — salad crops and fresh vegetables — rather than full calorie closure.",
      },
    ],
  },
  {
    id: "insight-seismology",
    title: "InSight: Seismic Interior Structure and the Size of Mars's Core",
    source: "InSight Mission Science Team",
    year: 2023,
    topic: "Interior & Geophysics",
    sections: [
      {
        heading: "Listening to marsquakes",
        body: "NASA's InSight lander, which touched down in Elysium Planitia in November 2018, carried the first seismometer operated on another planet (SEIS), sensitive enough to detect ground motions smaller than a hydrogen atom. By mission end in December 2022, SEIS had catalogued more than 1,300 marsquakes, most small (magnitude 1 to 3.5) and originating in the Cerberus Fossae fault system about 1,500 km away — evidence that region is still tectonically and volcanically active. The largest event, a magnitude 4.7 quake on May 4, 2022, released five times the energy of all prior quakes combined and rang through the planet long enough to measure surface waves circling Mars.",
      },
      {
        heading: "Core, mantle and crust measurements",
        body: "Seismic waves reflecting off internal boundaries let InSight measure Mars's structure directly: the crust beneath the lander is 24 to 72 km thick (two candidate models), the mantle extends to about 1,560 km depth, and the liquid iron core has a radius of 1,830 ± 40 km — substantially larger and less dense than expected, implying the core contains significant light elements such as sulfur, oxygen and carbon. A large, light core helps explain why Mars's internal dynamo died early: without enough cooling-driven convection to sustain it, Mars lost its magnetic shield roughly 4 billion years ago, after which the solar wind stripped much of its atmosphere — a direct seismic link between interior structure and surface habitability history.",
      },
      {
        heading: "Meteoroid impacts as seismic sources",
        body: "InSight also detected the seismic and acoustic waves from meteoroid impacts, including an impact on September 5, 2021 that was later imaged from orbit, and a December 24, 2021 strike that excavated a 150-metre crater — the largest fresh crater observed forming during the mission — throwing blocks of buried water ice the size of boulders around the crater rim at only 35.4° N latitude. These events calibrated how seismic energy maps to crater size, letting scientists convert quake catalogues into impact rates and interior models, and they independently confirmed accessible subsurface ice surprisingly close to the equator. InSight's power ended when dust covered its solar panels, reducing output to under 20 percent, but its four-year dataset remains the reference for Mars interior models.",
      },
    ],
  },
];
