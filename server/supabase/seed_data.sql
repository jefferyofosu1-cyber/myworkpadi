-- TaskGH Seed Data (Categories)
-- Based on src/constants/data.js

INSERT INTO public.categories (name, description, assessment_fee_ghs, icon_name)
VALUES 
('AC Repair & Servicing', 'Diagnose, clean, regas, and repair all AC brands. Same-day available in most areas.', 300.00, 'AC'),
('Electrical Repairs', 'Fault finding, socket repairs, wiring, breaker issues, and rewiring.', 300.00, 'EL'),
('Light Installation', 'Ceiling lights, bulb replacements, chandelier installation.', 300.00, 'LT'),
('Generator Repair', 'Diagnose and fix generator faults. Servicing and maintenance packages available.', 300.00, 'GR'),
('Plumbing Repairs', 'Leaking pipes, burst pipes, blocked drains, toilet repairs, and fixture installation.', 300.00, 'PL'),
('Polytank Cleaning', 'Deep clean and disinfect your polytank. Before/after photos provided.', 300.00, 'PT'),
('Borehole & Pump Repair', 'Submersible pump repair, borehole servicing, pressure tank issues.', 300.00, 'BH'),
('House Cleaning', 'Full home clean with all equipment provided. Weekly packages available.', 300.00, 'CL'),
('Deep Cleaning', 'Intensive clean for kitchens, bathrooms, and heavily soiled areas.', 300.00, 'DC'),
('Sofa & Carpet Cleaning', 'Steam clean sofas, mattresses, rugs, and carpets.', 300.00, 'CP'),
('Fumigation & Pest Control', 'Cockroaches, mosquitoes, rats, bedbugs, and termites.', 300.00, 'FM'),
('Interior Painting', 'Walls, ceilings, trim. Emulsion, oil, or textured finishes.', 300.00, 'IP'),
('Exterior Painting', 'Weather-resistant exterior coatings. Compound walls and gates included.', 300.00, 'EP'),
('Carpentry & Woodwork', 'Doors, windows, cabinets, furniture repairs, and custom woodwork.', 300.00, 'CP'),
('Tiling & Floor Laying', 'Floor and wall tiles, bathroom tiling, and grouting.', 300.00, 'TL'),
('CCTV Installation', 'IP cameras, DVR setup, night vision, and remote viewing configuration.', 300.00, 'CV'),
('Door Lock & Security', 'Lock replacement, mortise locks, digital locks, and deadbolts.', 300.00, 'SL'),
('Solar Panel Installation', 'Grid-tie and off-grid solar systems. Inverter and battery setup.', 300.00, 'SO'),
('TV Mounting & Setup', 'Wall-mount any TV size. HDMI setup, cable management included.', 300.00, 'TV'),
('Garden & Lawn Care', 'Grass cutting, trimming, weeding, and compound maintenance.', 300.00, 'GD');
