-- Clear existing data (if any) and insert fresh communities data
DELETE FROM community_members;
DELETE FROM posts; 
DELETE FROM communities;

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

-- Note: Community memberships and posts will be added when real users sign up and join communities
-- This seed file only creates the basic community structure

-- Confirm data insertion
SELECT 'Database seeded successfully!' as status;