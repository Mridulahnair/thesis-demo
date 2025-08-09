-- Clear existing data (if any) and insert fresh communities data
DELETE FROM community_members;
DELETE FROM posts; 
DELETE FROM profiles;
DELETE FROM communities;
DELETE FROM auth.users;

-- Create dummy auth.users entries and full profiles directly
-- First delete any existing auth.users and create new ones
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
) VALUES
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'sarah.chen@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Sarah Chen"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'alex.rivera@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Alex Rivera"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'margaret.thompson@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Margaret Thompson"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'david.kim@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "David Kim"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'eleanor.walsh@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Eleanor Walsh"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666', 'authenticated', 'authenticated', 'maya.patel@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Maya Patel"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '77777777-7777-7777-7777-777777777777', 'authenticated', 'authenticated', 'robert.johnson@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Robert Johnson"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '88888888-8888-8888-8888-888888888888', 'authenticated', 'authenticated', 'emma.rodriguez@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Emma Rodriguez"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '99999999-9999-9999-9999-999999999999', 'authenticated', 'authenticated', 'frank.miller@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Frank Miller"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '10101010-1010-1010-1010-101010101010', 'authenticated', 'authenticated', 'isabella.chen@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Isabella Chen"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111112', 'authenticated', 'authenticated', 'linda.williams@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Dr. Linda Williams"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '12121212-1212-1212-1212-121212121212', 'authenticated', 'authenticated', 'marcus.johnson@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Marcus Johnson"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '13131313-1313-1313-1313-131313131313', 'authenticated', 'authenticated', 'maria.santos@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Professor Maria Santos"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '14141414-1414-1414-1414-141414141414', 'authenticated', 'authenticated', 'james.wilson@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "James Wilson"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '15151515-1515-1515-1515-151515151515', 'authenticated', 'authenticated', 'giuseppe.romano@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Maestro Giuseppe Romano"}', NOW(), NOW(), '', ''),
('00000000-0000-0000-0000-000000000000', '16161616-1616-1616-1616-161616161616', 'authenticated', 'authenticated', 'zoe.taylor@example.com', '$2a$10$dummy.encrypted.password.hash', NOW(), '{"name": "Zoe Taylor"}', NOW(), NOW(), '', '');

-- Delete the basic profiles created by trigger and insert complete ones
DELETE FROM profiles;
INSERT INTO profiles (id, name, email, bio, interests, role, location, skills, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Sarah Chen', 'sarah.chen@example.com', 'Retired software engineer with 30+ years at Microsoft. Passionate about teaching coding fundamentals and sharing industry insights with the next generation.', ARRAY['Programming', 'Technology', 'Mentoring'], 'mentor', 'Seattle, WA', ARRAY['Python', 'Java', 'Software Architecture', 'Career Guidance'], NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Alex Rivera', 'alex.rivera@example.com', 'Computer Science student at University of Washington. Love building apps and learning from experienced developers about career paths and best practices.', ARRAY['Programming', 'Web Development', 'Career Growth'], 'mentee', 'Seattle, WA', ARRAY['React', 'Node.js', 'UI/UX Design'], NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Margaret Thompson', 'margaret.thompson@example.com', 'Master baker and former culinary school instructor. Excited to share traditional baking techniques and learn about modern food trends.', ARRAY['Baking', 'Cooking', 'Traditional Recipes'], 'mentor', 'Portland, OR', ARRAY['Bread Making', 'Pastry Techniques', 'Recipe Development'], NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'David Kim', 'david.kim@example.com', 'Aspiring chef and culinary school graduate. Looking to connect with experienced cooks to learn family recipes and traditional techniques.', ARRAY['Cooking', 'Culinary Arts', 'Food Culture'], 'mentee', 'Portland, OR', ARRAY['Modern Cooking Techniques', 'Food Styling'], NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Eleanor Walsh', 'eleanor.walsh@example.com', 'Retired art teacher with expertise in watercolor and oil painting. Love fostering creativity in artists of all ages.', ARRAY['Art', 'Painting', 'Teaching'], 'mentor', 'San Francisco, CA', ARRAY['Watercolor', 'Oil Painting', 'Art History', 'Teaching Methods'], NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'Maya Patel', 'maya.patel@example.com', 'Graphic design student passionate about traditional art forms. Eager to learn from experienced artists and share digital design skills.', ARRAY['Design', 'Art', 'Digital Media'], 'mentee', 'San Francisco, CA', ARRAY['Digital Design', 'Adobe Creative Suite', 'Social Media'], NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'Robert Johnson', 'robert.johnson@example.com', 'Former CEO of a mid-size tech company. Now focusing on helping young entrepreneurs navigate business challenges and leadership development.', ARRAY['Business', 'Leadership', 'Entrepreneurship'], 'mentor', 'Austin, TX', ARRAY['Strategic Planning', 'Leadership', 'Business Development', 'Fundraising'], NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'Emma Rodriguez', 'emma.rodriguez@example.com', 'First-time entrepreneur building a sustainable fashion startup. Looking for guidance on scaling, leadership, and industry connections.', ARRAY['Entrepreneurship', 'Sustainability', 'Fashion'], 'mentee', 'Austin, TX', ARRAY['Product Development', 'Sustainable Practices', 'Digital Marketing'], NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', 'Frank Miller', 'frank.miller@example.com', 'Retired master gardener with 40+ years of experience. Passionate about organic gardening and teaching sustainable growing practices.', ARRAY['Gardening', 'Sustainability', 'Environment'], 'mentor', 'Denver, CO', ARRAY['Organic Gardening', 'Composting', 'Plant Diseases', 'Seasonal Planning'], NOW(), NOW()),
('10101010-1010-1010-1010-101010101010', 'Isabella Chen', 'isabella.chen@example.com', 'Environmental science graduate student researching urban sustainability. Interested in learning traditional growing methods and sharing modern techniques.', ARRAY['Sustainability', 'Environment', 'Research'], 'mentee', 'Denver, CO', ARRAY['Research Methods', 'Data Analysis', 'Environmental Policy'], NOW(), NOW()),
('11111111-1111-1111-1111-111111111112', 'Dr. Linda Williams', 'linda.williams@example.com', 'Retired physical therapist and yoga instructor with 25 years experience. Passionate about holistic wellness and helping others find balance in mind and body.', ARRAY['Health', 'Wellness', 'Yoga'], 'mentor', 'Miami, FL', ARRAY['Physical Therapy', 'Yoga', 'Meditation', 'Injury Prevention'], NOW(), NOW()),
('12121212-1212-1212-1212-121212121212', 'Marcus Johnson', 'marcus.johnson@example.com', 'Personal trainer and nutrition coach in his late 20s. Looking to learn traditional wellness practices and share modern fitness techniques.', ARRAY['Fitness', 'Nutrition', 'Health'], 'mentee', 'Miami, FL', ARRAY['Strength Training', 'Nutrition Planning', 'Fitness Technology'], NOW(), NOW()),
('13131313-1313-1313-1313-131313131313', 'Professor Maria Santos', 'maria.santos@example.com', 'Retired Spanish literature professor who taught for 35 years. Native speaker excited to share language and cultural knowledge.', ARRAY['Languages', 'Culture', 'Literature'], 'mentor', 'Los Angeles, CA', ARRAY['Spanish Language', 'Literature', 'Cultural History', 'Teaching'], NOW(), NOW()),
('14141414-1414-1414-1414-141414141414', 'James Wilson', 'james.wilson@example.com', 'Polyglot software engineer learning Spanish and Portuguese. Fluent in English, French, and Mandarin. Love cultural exchange.', ARRAY['Languages', 'Culture', 'Travel'], 'mentee', 'Los Angeles, CA', ARRAY['English', 'French', 'Mandarin', 'Programming'], NOW(), NOW()),
('15151515-1515-1515-1515-151515151515', 'Maestro Giuseppe Romano', 'giuseppe.romano@example.com', 'Retired opera singer and voice coach with 40+ years of experience. Performed in major opera houses worldwide.', ARRAY['Music', 'Opera', 'Voice'], 'mentor', 'New York, NY', ARRAY['Classical Voice', 'Opera', 'Music Theory', 'Performance'], NOW(), NOW()),
('16161616-1616-1616-1616-161616161616', 'Zoe Taylor', 'zoe.taylor@example.com', 'Singer-songwriter and music producer. Combines classical training with modern pop and indie influences. Always learning new techniques.', ARRAY['Music', 'Songwriting', 'Production'], 'mentee', 'New York, NY', ARRAY['Songwriting', 'Music Production', 'Guitar', 'Piano'], NOW(), NOW());

-- Insert communities data
INSERT INTO communities (id, name, description, categories, featured) VALUES
('tech-digital', 'Tech & Digital Skills', 'Bridging the digital divide. Young tech enthusiasts teaching seniors, while learning wisdom about problem-solving and patience.', ARRAY['Technology', 'Programming', 'Digital Literacy'], true),
('creative-arts', 'Creative Arts & Crafts', 'Traditional craftsmanship meets modern creativity. Master artisans sharing techniques with emerging artists.', ARRAY['Art', 'Crafts', 'Design', 'Photography'], true),
('cooking-culinary', 'Cooking & Culinary Traditions', 'Family recipes and cooking techniques passed down through generations, mixed with modern culinary innovation.', ARRAY['Cooking', 'Baking', 'Traditional Recipes'], false),
('career-business', 'Career & Business Wisdom', 'Experienced professionals mentoring young entrepreneurs and career starters. Share insights on leadership and growth.', ARRAY['Business', 'Career', 'Leadership', 'Entrepreneurship'], true),
('health-wellness', 'Health & Wellness', 'Holistic health practices, fitness routines, and wellness wisdom shared across generations.', ARRAY['Health', 'Fitness', 'Mental Wellness', 'Nutrition'], false),
('gardening-sustainability', 'Gardening & Sustainability', 'Traditional gardening wisdom meets modern sustainability practices. Growing together, literally and figuratively.', ARRAY['Gardening', 'Sustainability', 'Environment'], false),
('languages-culture', 'Languages & Cultural Exchange', 'Learn languages, share cultural traditions, and build understanding across different backgrounds and generations.', ARRAY['Languages', 'Culture', 'Travel', 'Traditions'], false),
('music-performance', 'Music & Performance Arts', 'From classical to contemporary, share musical knowledge and performance skills across generations.', ARRAY['Music', 'Performance', 'Instruments', 'Singing'], false);

-- Create sample posts for demonstration (using dummy profile IDs)
-- Note: These posts won't have real users behind them, but will populate the communities with content
INSERT INTO posts (id, community_id, author_id, title, content, created_at) VALUES
('a1111111-1111-1111-1111-111111111111', 'tech-digital', '11111111-1111-1111-1111-111111111111', 'Offering Python Mentorship Sessions', 'Hi everyone! I''m Sarah, recently retired from Microsoft where I spent 30+ years in software development. I''m offering free 1-on-1 Python mentorship sessions for beginners. We can cover basics, best practices, or even career advice. Who''s interested in connecting?', NOW() - INTERVAL '2 days'),
('a2222222-2222-2222-2222-222222222222', 'tech-digital', '22222222-2222-2222-2222-222222222222', 'Looking for System Design Guidance', 'Hey fellow developers! I''m Alex, a CS student working on my capstone project. I could really use some guidance on system design and scalability from someone with industry experience. Happy to share what I know about modern React patterns in exchange!', NOW() - INTERVAL '1 day'),
('a3333333-3333-3333-3333-333333333333', 'creative-arts', '55555555-5555-5555-5555-555555555555', 'Watercolor Workshop This Weekend', 'Hello artists! Eleanor here 🎨 I''m hosting a small watercolor workshop this Saturday in Golden Gate Park (weather permitting). Perfect for beginners or anyone wanting to refresh their basics. I''ll provide supplies. Who wants to paint with me?', NOW() - INTERVAL '3 days'),
('a4444444-4444-4444-4444-444444444444', 'creative-arts', '66666666-6666-6666-6666-666666666666', 'Digital Art Portfolio Review Exchange', 'Hi everyone! Maya here - I''m a graphic design student who would love to get feedback on my portfolio from experienced artists. In return, I''d be happy to help anyone set up their online presence or create digital versions of their artwork. Fair trade?', NOW() - INTERVAL '1 day'),
('a5555555-5555-5555-5555-555555555555', 'cooking-culinary', '33333333-3333-3333-3333-333333333333', 'Traditional Bread Making Class', 'Greetings, fellow bakers! Margaret here 🍞 I''m thinking of hosting a sourdough bread making session at my home kitchen. I''ve been perfecting my starter for 40+ years! Anyone interested in learning the traditional way? I''d love to learn about modern baking trends too.', NOW() - INTERVAL '4 days'),
('a6666666-6666-6666-6666-666666666666', 'cooking-culinary', '44444444-4444-4444-4444-444444444444', 'Seeking Family Recipe Stories', 'Hello! David here, a recent culinary school grad. I''m working on a project documenting traditional family recipes and their stories. Would any experienced cooks be willing to share a special recipe and its history? I''ll test it out and share my modern take!', NOW() - INTERVAL '2 days'),
('a7777777-7777-7777-7777-777777777777', 'career-business', '77777777-7777-7777-7777-777777777777', 'Startup Mentorship Office Hours', 'Hi entrepreneurs! Robert here, former tech CEO. I''m starting weekly "office hours" every Thursday evening to help early-stage founders with strategy, fundraising, or just general business questions. No agenda, just open discussion. Coffee''s on me!', NOW() - INTERVAL '5 days'),
('a8888888-8888-8888-8888-888888888888', 'career-business', '88888888-8888-8888-8888-888888888888', 'Looking for Industry Connections', 'Hey everyone! Emma from the sustainable fashion startup here. I''m looking to connect with experienced business leaders who might have insights into the fashion industry or sustainable business practices. Also happy to share what I''ve learned about modern digital marketing!', NOW() - INTERVAL '1 day'),
('a9999999-9999-9999-9999-999999999999', 'gardening-sustainability', '99999999-9999-9999-9999-999999999999', 'Spring Garden Planning Session', 'Hello gardeners! 🌱 Frank here. Spring is coming and I''m planning my 40th vegetable garden! I''d love to share planning tips and seed starting techniques. Also curious about these new hydroponic systems I keep hearing about. Anyone want to do a garden planning session?', NOW() - INTERVAL '6 days'),
('a1010101-0101-0101-0101-010101010101', 'gardening-sustainability', '10101010-1010-1010-1010-101010101010', 'Urban Farming Research Partnership', 'Hi sustainability enthusiasts! Isabella here, working on my environmental science thesis about urban farming. I''m looking for experienced gardeners to interview about traditional methods. In return, I can share the latest research on soil health and climate-adaptive growing!', NOW() - INTERVAL '3 days'),
('a1111111-1111-1111-1111-111111111112', 'health-wellness', '11111111-1111-1111-1111-111111111112', 'Gentle Yoga for Seniors', 'Hello wellness community! 🧘‍♀️ Dr. Linda here. I''m offering gentle yoga sessions specifically designed for seniors or anyone dealing with mobility issues. We''ll focus on breathing, balance, and pain relief. I''d also love to learn about modern fitness tracking apps from younger members!', NOW() - INTERVAL '3 days'),
('a1212121-2121-2121-2121-212121212121', 'health-wellness', '12121212-1212-1212-1212-121212121212', 'Nutrition + Traditional Medicine Exchange', 'Hey everyone! Marcus here, personal trainer and nutritionist. I''m fascinated by traditional healing practices and herbal medicine. Would love to connect with anyone who has knowledge about traditional remedies. In exchange, I can share modern nutrition science and fitness techniques!', NOW() - INTERVAL '1 day'),
('a1313131-3131-3131-3131-313131313131', 'languages-culture', '13131313-1313-1313-1313-131313131313', 'Spanish Language & Culture Circle', '¡Hola amigos! Profesora Maria here 📚 I''m starting a weekly Spanish conversation circle where we can practice language AND share stories about Latin American culture. All levels welcome! I''m also curious about language learning apps - which ones do you recommend?', NOW() - INTERVAL '4 days'),
('a1414141-4141-4141-4141-414141414141', 'languages-culture', '14141414-1414-1414-1414-141414141414', 'Polyglot Language Exchange', 'Hello language lovers! James here, fluent in English, French, and Mandarin, learning Spanish. Looking for native Spanish speakers to practice with. I can help with any of my languages or even teach basic programming concepts en español! Cultural exchange is my passion 🌍', NOW() - INTERVAL '2 days'),
('a1515151-5151-5151-5151-515151515151', 'music-performance', '15151515-1515-1515-1515-151515151515', 'Opera Appreciation & Voice Lessons', 'Greetings music lovers! 🎭 Maestro Giuseppe here. I''m offering free voice coaching sessions and opera appreciation talks. Whether you''re a beginner or experienced singer, I''d love to share classical techniques. Also curious about modern recording equipment - the technology has changed so much!', NOW() - INTERVAL '5 days'),
('a1616161-6161-6161-6161-616161616161', 'music-performance', '16161616-1616-1616-1616-161616161616', 'Songwriting Collaboration & Vocal Health', 'Hi musicians! Zoe here 🎵 Singer-songwriter looking to collaborate and learn from experienced vocalists. I can share modern production techniques and songwriting methods. Really interested in learning about vocal health and longevity from classical singers. Let''s create something together!', NOW() - INTERVAL '1 day');

-- Create community memberships for the dummy users
INSERT INTO community_members (community_id, user_id, joined_at) VALUES
('tech-digital', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '30 days'),
('tech-digital', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '25 days'),
('creative-arts', '55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '45 days'),
('creative-arts', '66666666-6666-6666-6666-666666666666', NOW() - INTERVAL '20 days'),
('cooking-culinary', '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '35 days'),
('cooking-culinary', '44444444-4444-4444-4444-444444444444', NOW() - INTERVAL '15 days'),
('career-business', '77777777-7777-7777-7777-777777777777', NOW() - INTERVAL '40 days'),
('career-business', '88888888-8888-8888-8888-888888888888', NOW() - INTERVAL '12 days'),
('gardening-sustainability', '99999999-9999-9999-9999-999999999999', NOW() - INTERVAL '50 days'),
('gardening-sustainability', '10101010-1010-1010-1010-101010101010', NOW() - INTERVAL '18 days'),
('health-wellness', '11111111-1111-1111-1111-111111111112', NOW() - INTERVAL '60 days'),
('health-wellness', '12121212-1212-1212-1212-121212121212', NOW() - INTERVAL '22 days'),
('languages-culture', '13131313-1313-1313-1313-131313131313', NOW() - INTERVAL '55 days'),
('languages-culture', '14141414-1414-1414-1414-141414141414', NOW() - INTERVAL '28 days'),
('music-performance', '15151515-1515-1515-1515-151515151515', NOW() - INTERVAL '70 days'),
('music-performance', '16161616-1616-1616-1616-161616161616', NOW() - INTERVAL '14 days');

-- Confirm data insertion
SELECT 'Database seeded successfully with 16 dummy users, 8 communities, 16 posts, and community memberships!' as status;