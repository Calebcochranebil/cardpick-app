-- =============================================
-- STAX FULL CARD DATABASE
-- Run this in Supabase SQL Editor
-- =============================================

-- Add affiliate_url column if it doesn't exist
ALTER TABLE cards ADD COLUMN IF NOT EXISTS affiliate_url TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS signup_bonus TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS signup_bonus_value INTEGER DEFAULT 0;

-- =============================================
-- CHASE CARDS
-- =============================================

-- Chase Sapphire Reserve
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('chase-sapphire-reserve', 'Sapphire Reserve', 'Chase', 'visa', 550, 1, 'points', '#0A1628', '#1a2d4a', '#0A1628', '60,000 points after $4,000 spend in 3 months', 900)
ON CONFLICT (id) DO UPDATE SET annual_fee = 550, signup_bonus = '60,000 points after $4,000 spend in 3 months', signup_bonus_value = 900;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('chase-sapphire-reserve', 'travel', 3, '3x on travel after $300 travel credit'),
('chase-sapphire-reserve', 'dining', 3, '3x on dining worldwide'),
('chase-sapphire-reserve', 'streaming', 3, '3x on select streaming services')
ON CONFLICT DO NOTHING;

-- Chase Sapphire Preferred (update existing)
UPDATE cards SET signup_bonus = '60,000 points after $4,000 spend in 3 months', signup_bonus_value = 750 WHERE id = 'chase-sapphire-preferred';

-- Chase Freedom Flex
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('chase-freedom-flex', 'Freedom Flex', 'Chase', 'mastercard', 0, 1, 'cashback', '#0ea5e9', '#0284c7', '#0369a1', '$200 after $500 spend in 3 months', 200)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$200 after $500 spend in 3 months', signup_bonus_value = 200;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('chase-freedom-flex', 'rotating', 5, '5% on rotating quarterly categories (up to $1,500)'),
('chase-freedom-flex', 'travel_portal', 5, '5% on travel via Chase'),
('chase-freedom-flex', 'dining', 3, '3% on dining'),
('chase-freedom-flex', 'drugstore', 3, '3% on drugstores')
ON CONFLICT DO NOTHING;

-- Update Chase Freedom Unlimited
UPDATE cards SET signup_bonus = '$200 after $500 spend in 3 months', signup_bonus_value = 200 WHERE id = 'chase-freedom-unlimited';

-- Chase Ink Business Preferred
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('chase-ink-preferred', 'Ink Business Preferred', 'Chase', 'visa', 95, 1, 'points', '#1e3a5f', '#2d4a6f', '#1e3a5f', '100,000 points after $8,000 spend in 3 months', 1250)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '100,000 points after $8,000 spend in 3 months', signup_bonus_value = 1250;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('chase-ink-preferred', 'travel', 3, '3x on travel'),
('chase-ink-preferred', 'shipping', 3, '3x on shipping'),
('chase-ink-preferred', 'internet_cable_phone', 3, '3x on internet, cable, phone'),
('chase-ink-preferred', 'advertising', 3, '3x on social media and search advertising (up to $150k/yr)')
ON CONFLICT DO NOTHING;

-- Chase Ink Business Cash
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('chase-ink-cash', 'Ink Business Cash', 'Chase', 'visa', 0, 1, 'cashback', '#374151', '#4b5563', '#374151', '$350 after $3,000 spend in 3 months', 350)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$350 after $3,000 spend in 3 months', signup_bonus_value = 350;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('chase-ink-cash', 'office_supplies', 5, '5% on office supplies (up to $25k/yr)'),
('chase-ink-cash', 'internet_cable_phone', 5, '5% on internet, cable, phone (up to $25k/yr)'),
('chase-ink-cash', 'gas', 2, '2% on gas and dining (up to $25k/yr)')
ON CONFLICT DO NOTHING;

-- Chase Ink Business Unlimited
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('chase-ink-unlimited', 'Ink Business Unlimited', 'Chase', 'visa', 0, 1.5, 'cashback', '#6b7280', '#9ca3af', '#6b7280', '$500 after $3,000 spend in 3 months', 500)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$500 after $3,000 spend in 3 months', signup_bonus_value = 500;

-- =============================================
-- AMERICAN EXPRESS CARDS
-- =============================================

-- Update Amex Gold
UPDATE cards SET signup_bonus = '60,000 points after $6,000 spend in 6 months', signup_bonus_value = 1200 WHERE id = 'amex-gold';

-- Amex Platinum
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('amex-platinum', 'Platinum Card', 'American Express', 'amex', 695, 1, 'points', '#E5E4E2', '#C0C0C0', '#A9A9A9', '80,000 points after $8,000 spend in 6 months', 1600)
ON CONFLICT (id) DO UPDATE SET annual_fee = 695, signup_bonus = '80,000 points after $8,000 spend in 6 months', signup_bonus_value = 1600;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('amex-platinum', 'flights', 5, '5x on flights booked directly with airlines'),
('amex-platinum', 'amex_travel', 5, '5x on flights booked through Amex Travel'),
('amex-platinum', 'hotels_amex', 5, '5x on prepaid hotels via Amex Travel')
ON CONFLICT DO NOTHING;

-- Amex Blue Cash Preferred
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('amex-blue-cash-preferred', 'Blue Cash Preferred', 'American Express', 'amex', 95, 1, 'cashback', '#006FCF', '#0050a0', '#003875', '$250 after $3,000 spend in 6 months', 250)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$250 after $3,000 spend in 6 months', signup_bonus_value = 250;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('amex-blue-cash-preferred', 'grocery', 6, '6% at U.S. supermarkets (up to $6k/yr)'),
('amex-blue-cash-preferred', 'streaming', 6, '6% on select U.S. streaming'),
('amex-blue-cash-preferred', 'transit', 3, '3% on transit and U.S. gas stations'),
('amex-blue-cash-preferred', 'gas', 3, '3% at U.S. gas stations')
ON CONFLICT DO NOTHING;

-- Amex Blue Cash Everyday
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('amex-blue-cash-everyday', 'Blue Cash Everyday', 'American Express', 'amex', 0, 1, 'cashback', '#0077c5', '#005fa3', '#004680', '$200 after $2,000 spend in 6 months', 200)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$200 after $2,000 spend in 6 months', signup_bonus_value = 200;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('amex-blue-cash-everyday', 'grocery', 3, '3% at U.S. supermarkets (up to $6k/yr)'),
('amex-blue-cash-everyday', 'gas', 3, '3% at U.S. gas stations'),
('amex-blue-cash-everyday', 'online_retail', 3, '3% on U.S. online retail purchases')
ON CONFLICT DO NOTHING;

-- Amex Green
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('amex-green', 'Green Card', 'American Express', 'amex', 150, 1, 'points', '#2E8B57', '#228B22', '#006400', '40,000 points after $3,000 spend in 6 months', 800)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '40,000 points after $3,000 spend in 6 months', signup_bonus_value = 800;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('amex-green', 'travel', 3, '3x on travel including flights, hotels, transit'),
('amex-green', 'dining', 3, '3x on restaurants worldwide'),
('amex-green', 'transit', 3, '3x on transit')
ON CONFLICT DO NOTHING;

-- Amex Delta SkyMiles Gold
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('amex-delta-gold', 'Delta SkyMiles Gold', 'American Express', 'amex', 150, 1, 'miles', '#86272B', '#6B1F22', '#4F171A', '50,000 miles after $3,000 spend in 6 months', 500)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '50,000 miles after $3,000 spend in 6 months', signup_bonus_value = 500;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('amex-delta-gold', 'delta', 2, '2x on Delta purchases'),
('amex-delta-gold', 'dining', 2, '2x at restaurants'),
('amex-delta-gold', 'grocery', 2, '2x at U.S. supermarkets')
ON CONFLICT DO NOTHING;

-- Amex Delta SkyMiles Platinum
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('amex-delta-platinum', 'Delta SkyMiles Platinum', 'American Express', 'amex', 350, 1, 'miles', '#5c5c5c', '#4a4a4a', '#383838', '70,000 miles after $4,000 spend in 6 months', 700)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '70,000 miles after $4,000 spend in 6 months', signup_bonus_value = 700;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('amex-delta-platinum', 'delta', 3, '3x on Delta purchases'),
('amex-delta-platinum', 'hotels', 2, '2x on hotels'),
('amex-delta-platinum', 'dining', 2, '2x at restaurants')
ON CONFLICT DO NOTHING;

-- Amex Hilton Honors
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('amex-hilton', 'Hilton Honors Card', 'American Express', 'amex', 0, 3, 'points', '#003366', '#002244', '#001122', '70,000 points after $2,000 spend in 6 months', 350)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '70,000 points after $2,000 spend in 6 months', signup_bonus_value = 350;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('amex-hilton', 'hilton', 7, '7x at Hilton hotels'),
('amex-hilton', 'dining', 5, '5x at restaurants'),
('amex-hilton', 'grocery', 5, '5x at U.S. supermarkets'),
('amex-hilton', 'gas', 5, '5x at U.S. gas stations')
ON CONFLICT DO NOTHING;

-- Amex Hilton Surpass
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('amex-hilton-surpass', 'Hilton Honors Surpass', 'American Express', 'amex', 150, 3, 'points', '#6B4C9A', '#5A3D89', '#492E78', '130,000 points after $3,000 spend in 6 months', 650)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '130,000 points after $3,000 spend in 6 months', signup_bonus_value = 650;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('amex-hilton-surpass', 'hilton', 12, '12x at Hilton hotels'),
('amex-hilton-surpass', 'dining', 6, '6x at restaurants'),
('amex-hilton-surpass', 'grocery', 6, '6x at U.S. supermarkets'),
('amex-hilton-surpass', 'gas', 6, '6x at U.S. gas stations')
ON CONFLICT DO NOTHING;

-- Amex Marriott Bonvoy
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('amex-marriott-bonvoy', 'Marriott Bonvoy Card', 'American Express', 'amex', 95, 2, 'points', '#8B0000', '#6B0000', '#4B0000', '85,000 points after $4,000 spend in 6 months', 680)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '85,000 points after $4,000 spend in 6 months', signup_bonus_value = 680;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('amex-marriott-bonvoy', 'marriott', 4, '4x at Marriott hotels'),
('amex-marriott-bonvoy', 'dining', 2, '2x at restaurants'),
('amex-marriott-bonvoy', 'grocery', 2, '2x at U.S. supermarkets')
ON CONFLICT DO NOTHING;

-- =============================================
-- CAPITAL ONE CARDS
-- =============================================

-- Update Capital One Venture X
UPDATE cards SET signup_bonus = '75,000 miles after $4,000 spend in 3 months', signup_bonus_value = 1125 WHERE id = 'capital-one-venture-x';

-- Capital One Venture
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('capital-one-venture', 'Venture Rewards', 'Capital One', 'visa', 95, 2, 'miles', '#004977', '#003d66', '#002d4d', '75,000 miles after $4,000 spend in 3 months', 750)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '75,000 miles after $4,000 spend in 3 months', signup_bonus_value = 750;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('capital-one-venture', 'hotels_capital_one', 5, '5x on hotels and rental cars via Capital One Travel')
ON CONFLICT DO NOTHING;

-- Capital One VentureOne
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('capital-one-ventureone', 'VentureOne Rewards', 'Capital One', 'visa', 0, 1.25, 'miles', '#007bff', '#0056b3', '#003d80', '20,000 miles after $500 spend in 3 months', 200)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '20,000 miles after $500 spend in 3 months', signup_bonus_value = 200;

-- Capital One Quicksilver
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('capital-one-quicksilver', 'Quicksilver Cash Rewards', 'Capital One', 'mastercard', 0, 1.5, 'cashback', '#78909C', '#607D8B', '#455A64', '$200 after $500 spend in 3 months', 200)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$200 after $500 spend in 3 months', signup_bonus_value = 200;

-- Capital One SavorOne
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('capital-one-savorone', 'SavorOne Cash Rewards', 'Capital One', 'mastercard', 0, 1, 'cashback', '#FF6B35', '#F7444E', '#D92027', '$200 after $500 spend in 3 months', 200)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$200 after $500 spend in 3 months', signup_bonus_value = 200;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('capital-one-savorone', 'dining', 3, '3% on dining and entertainment'),
('capital-one-savorone', 'entertainment', 3, '3% on entertainment'),
('capital-one-savorone', 'grocery', 3, '3% at grocery stores'),
('capital-one-savorone', 'streaming', 3, '3% on popular streaming services')
ON CONFLICT DO NOTHING;

-- Capital One Savor
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('capital-one-savor', 'Savor Cash Rewards', 'Capital One', 'mastercard', 95, 1, 'cashback', '#C41E3A', '#9B1B30', '#722026', '$300 after $3,000 spend in 3 months', 300)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$300 after $3,000 spend in 3 months', signup_bonus_value = 300;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('capital-one-savor', 'dining', 4, '4% on dining and entertainment'),
('capital-one-savor', 'entertainment', 4, '4% on entertainment'),
('capital-one-savor', 'grocery', 3, '3% at grocery stores'),
('capital-one-savor', 'streaming', 4, '4% on popular streaming services')
ON CONFLICT DO NOTHING;

-- =============================================
-- CITI CARDS
-- =============================================

-- Update Citi Double Cash
UPDATE cards SET signup_bonus = '$200 after $1,500 spend in 6 months', signup_bonus_value = 200 WHERE id = 'citi-double-cash';

-- Citi Custom Cash
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('citi-custom-cash', 'Custom Cash', 'Citi', 'mastercard', 0, 1, 'cashback', '#056DAE', '#045a8d', '#03476d', '$200 after $1,500 spend in 6 months', 200)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$200 after $1,500 spend in 6 months', signup_bonus_value = 200;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('citi-custom-cash', 'top_category', 5, '5% on your top eligible spend category each billing cycle (up to $500)')
ON CONFLICT DO NOTHING;

-- Citi Strata Premier (formerly Citi Premier)
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('citi-strata-premier', 'Strata Premier', 'Citi', 'mastercard', 95, 1, 'points', '#1a1a2e', '#16213e', '#0f3460', '75,000 points after $4,000 spend in 3 months', 750)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '75,000 points after $4,000 spend in 3 months', signup_bonus_value = 750;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('citi-strata-premier', 'dining', 3, '3x on dining'),
('citi-strata-premier', 'grocery', 3, '3x at supermarkets'),
('citi-strata-premier', 'gas', 3, '3x at gas stations'),
('citi-strata-premier', 'travel', 3, '3x on travel including flights, hotels'),
('citi-strata-premier', 'ev_charging', 3, '3x on EV charging')
ON CONFLICT DO NOTHING;

-- =============================================
-- DISCOVER CARDS
-- =============================================

-- Discover it Cash Back
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('discover-it-cashback', 'it Cash Back', 'Discover', 'discover', 0, 1, 'cashback', '#FF6600', '#E55B00', '#CC5200', 'Cashback Match first year (doubles all cash back)', 150)
ON CONFLICT (id) DO UPDATE SET signup_bonus = 'Cashback Match first year (doubles all cash back)', signup_bonus_value = 150;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('discover-it-cashback', 'rotating', 5, '5% on rotating quarterly categories (up to $1,500)')
ON CONFLICT DO NOTHING;

-- Discover it Miles
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('discover-it-miles', 'it Miles', 'Discover', 'discover', 0, 1.5, 'miles', '#4A90A4', '#3D7A8C', '#316474', 'Miles Match first year (doubles all miles)', 150)
ON CONFLICT (id) DO UPDATE SET signup_bonus = 'Miles Match first year (doubles all miles)', signup_bonus_value = 150;

-- =============================================
-- BANK OF AMERICA CARDS
-- =============================================

-- Bank of America Premium Rewards
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('bofa-premium-rewards', 'Premium Rewards', 'Bank of America', 'visa', 95, 1.5, 'points', '#012169', '#001a4d', '#001133', '60,000 points after $4,000 spend in 90 days', 600)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '60,000 points after $4,000 spend in 90 days', signup_bonus_value = 600;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('bofa-premium-rewards', 'travel', 2, '2 points per $1 on travel and dining'),
('bofa-premium-rewards', 'dining', 2, '2 points per $1 on dining')
ON CONFLICT DO NOTHING;

-- Bank of America Customized Cash
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('bofa-customized-cash', 'Customized Cash Rewards', 'Bank of America', 'visa', 0, 1, 'cashback', '#E31837', '#C01530', '#9D1228', '$200 after $1,000 spend in 90 days', 200)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$200 after $1,000 spend in 90 days', signup_bonus_value = 200;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('bofa-customized-cash', 'choice_category', 3, '3% in category of your choice (gas, online shopping, dining, travel, drugstores, or home improvement)'),
('bofa-customized-cash', 'grocery', 2, '2% at grocery stores and wholesale clubs (up to $2,500/quarter)')
ON CONFLICT DO NOTHING;

-- Bank of America Travel Rewards
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('bofa-travel-rewards', 'Travel Rewards', 'Bank of America', 'visa', 0, 1.5, 'points', '#004481', '#003366', '#00264d', '25,000 points after $1,000 spend in 90 days', 250)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '25,000 points after $1,000 spend in 90 days', signup_bonus_value = 250;

-- Bank of America Unlimited Cash
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('bofa-unlimited-cash', 'Unlimited Cash Rewards', 'Bank of America', 'visa', 0, 1.5, 'cashback', '#1a1a1a', '#333333', '#1a1a1a', '$200 after $1,000 spend in 90 days', 200)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$200 after $1,000 spend in 90 days', signup_bonus_value = 200;

-- =============================================
-- WELLS FARGO CARDS
-- =============================================

-- Wells Fargo Active Cash
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('wells-fargo-active-cash', 'Active Cash', 'Wells Fargo', 'visa', 0, 2, 'cashback', '#D71E28', '#B31B23', '#8F151C', '$200 after $500 spend in 3 months', 200)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$200 after $500 spend in 3 months', signup_bonus_value = 200;

-- Wells Fargo Autograph
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('wells-fargo-autograph', 'Autograph', 'Wells Fargo', 'visa', 0, 1, 'points', '#FFCD00', '#E6B800', '#CCA300', '20,000 points after $1,000 spend in 3 months', 200)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '20,000 points after $1,000 spend in 3 months', signup_bonus_value = 200;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('wells-fargo-autograph', 'dining', 3, '3x on restaurants'),
('wells-fargo-autograph', 'travel', 3, '3x on travel'),
('wells-fargo-autograph', 'gas', 3, '3x on gas stations'),
('wells-fargo-autograph', 'transit', 3, '3x on transit'),
('wells-fargo-autograph', 'streaming', 3, '3x on popular streaming services'),
('wells-fargo-autograph', 'phone_plans', 3, '3x on phone plans')
ON CONFLICT DO NOTHING;

-- Wells Fargo Autograph Journey
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('wells-fargo-autograph-journey', 'Autograph Journey', 'Wells Fargo', 'visa', 95, 1, 'points', '#1a1a1a', '#2d2d2d', '#404040', '60,000 points after $4,000 spend in 3 months', 600)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '60,000 points after $4,000 spend in 3 months', signup_bonus_value = 600;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('wells-fargo-autograph-journey', 'hotels', 5, '5x on hotels'),
('wells-fargo-autograph-journey', 'flights', 4, '4x on airlines'),
('wells-fargo-autograph-journey', 'dining', 3, '3x on restaurants'),
('wells-fargo-autograph-journey', 'car_rental', 3, '3x on car rentals')
ON CONFLICT DO NOTHING;

-- =============================================
-- US BANK CARDS
-- =============================================

-- US Bank Altitude Connect
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('usbank-altitude-connect', 'Altitude Connect', 'US Bank', 'visa', 95, 1, 'points', '#0033A0', '#002980', '#001F60', '50,000 points after $2,000 spend in 120 days', 500)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '50,000 points after $2,000 spend in 120 days', signup_bonus_value = 500;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('usbank-altitude-connect', 'travel', 5, '5x on prepaid hotels and car rentals via Real-Time Rewards'),
('usbank-altitude-connect', 'gas', 4, '4x on gas and EV charging'),
('usbank-altitude-connect', 'dining', 2, '2x on dining, streaming, and grocery delivery')
ON CONFLICT DO NOTHING;

-- US Bank Altitude Reserve
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('usbank-altitude-reserve', 'Altitude Reserve', 'US Bank', 'visa', 400, 1, 'points', '#2C3E50', '#1a252f', '#0d1318', '50,000 points after $4,500 spend in 90 days', 750)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '50,000 points after $4,500 spend in 90 days', signup_bonus_value = 750;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('usbank-altitude-reserve', 'travel', 3, '3x on travel'),
('usbank-altitude-reserve', 'dining', 3, '3x on dining'),
('usbank-altitude-reserve', 'mobile_wallet', 3, '3x on mobile wallet purchases (Apple Pay, Google Pay, Samsung Pay)')
ON CONFLICT DO NOTHING;

-- US Bank Cash+
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('usbank-cash-plus', 'Cash+', 'US Bank', 'visa', 0, 1, 'cashback', '#0073CF', '#005fa3', '#004c82', '$200 after $1,000 spend in 120 days', 200)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$200 after $1,000 spend in 120 days', signup_bonus_value = 200;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('usbank-cash-plus', 'choice_categories', 5, '5% on two categories you choose (up to $2,000/quarter)'),
('usbank-cash-plus', 'gas_grocery', 2, '2% on one everyday category (gas, grocery, or restaurants)')
ON CONFLICT DO NOTHING;

-- =============================================
-- BARCLAYS CARDS
-- =============================================

-- Barclays AAdvantage Aviator Red
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('barclays-aadvantage-aviator', 'AAdvantage Aviator Red', 'Barclays', 'mastercard', 99, 1, 'miles', '#ED1C24', '#C41E3A', '#9B1B30', '60,000 miles after first purchase', 600)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '60,000 miles after first purchase', signup_bonus_value = 600;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('barclays-aadvantage-aviator', 'american_airlines', 2, '2x on American Airlines purchases')
ON CONFLICT DO NOTHING;

-- Barclays JetBlue Plus
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('barclays-jetblue-plus', 'JetBlue Plus', 'Barclays', 'mastercard', 99, 1, 'points', '#003876', '#002855', '#001a33', '80,000 points after $1,000 spend in 90 days', 800)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '80,000 points after $1,000 spend in 90 days', signup_bonus_value = 800;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('barclays-jetblue-plus', 'jetblue', 6, '6x on JetBlue purchases'),
('barclays-jetblue-plus', 'dining', 2, '2x at restaurants'),
('barclays-jetblue-plus', 'grocery', 2, '2x at grocery stores')
ON CONFLICT DO NOTHING;

-- =============================================
-- SYNCHRONY / STORE CARDS
-- =============================================

-- Amazon Prime Visa
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('amazon-prime-visa', 'Prime Visa', 'Chase', 'visa', 0, 1, 'cashback', '#232F3E', '#1a242f', '#131a22', '$150 Amazon gift card instantly', 150)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$150 Amazon gift card instantly', signup_bonus_value = 150;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('amazon-prime-visa', 'amazon', 5, '5% back at Amazon.com and Whole Foods'),
('amazon-prime-visa', 'whole_foods', 5, '5% back at Whole Foods Market'),
('amazon-prime-visa', 'chase_travel', 5, '5% on Chase Travel purchases'),
('amazon-prime-visa', 'dining', 2, '2% at restaurants'),
('amazon-prime-visa', 'gas', 2, '2% at gas stations'),
('amazon-prime-visa', 'transit', 2, '2% on local transit and commuting')
ON CONFLICT DO NOTHING;

-- Apple Card
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('apple-card', 'Apple Card', 'Goldman Sachs', 'mastercard', 0, 1, 'cashback', '#F5F5F7', '#E8E8ED', '#D2D2D7', 'No traditional signup bonus', 0)
ON CONFLICT (id) DO UPDATE SET signup_bonus = 'No traditional signup bonus', signup_bonus_value = 0;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('apple-card', 'apple', 3, '3% on Apple purchases'),
('apple-card', 'apple_pay', 2, '2% on all Apple Pay purchases')
ON CONFLICT DO NOTHING;

-- Costco Anywhere Visa
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('costco-anywhere-visa', 'Costco Anywhere Visa', 'Citi', 'visa', 0, 1, 'cashback', '#005DAA', '#004c8c', '#003b6e', 'No traditional signup bonus', 0)
ON CONFLICT (id) DO UPDATE SET signup_bonus = 'No traditional signup bonus', signup_bonus_value = 0;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('costco-anywhere-visa', 'gas', 4, '4% on gas worldwide (up to $7,000/year)'),
('costco-anywhere-visa', 'travel', 3, '3% on restaurants and eligible travel'),
('costco-anywhere-visa', 'dining', 3, '3% on restaurants'),
('costco-anywhere-visa', 'costco', 2, '2% at Costco and Costco.com')
ON CONFLICT DO NOTHING;

-- Target RedCard Credit
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('target-redcard', 'RedCard Credit', 'Target', 'mastercard', 0, 1, 'cashback', '#CC0000', '#A30000', '#800000', 'No traditional signup bonus', 0)
ON CONFLICT (id) DO UPDATE SET signup_bonus = 'No traditional signup bonus', signup_bonus_value = 0;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('target-redcard', 'target', 5, '5% off at Target and Target.com')
ON CONFLICT DO NOTHING;

-- =============================================
-- PREMIUM TRAVEL CARDS
-- =============================================

-- United Club Infinite
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('chase-united-club-infinite', 'United Club Infinite', 'Chase', 'visa', 525, 1, 'miles', '#0033A0', '#002780', '#001a60', '80,000 miles after $5,000 spend in 3 months', 800)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '80,000 miles after $5,000 spend in 3 months', signup_bonus_value = 800;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('chase-united-club-infinite', 'united', 4, '4x on United purchases'),
('chase-united-club-infinite', 'travel', 2, '2x on all other travel'),
('chase-united-club-infinite', 'dining', 2, '2x on dining')
ON CONFLICT DO NOTHING;

-- Southwest Rapid Rewards Priority
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('chase-southwest-priority', 'Southwest Rapid Rewards Priority', 'Chase', 'visa', 149, 1, 'points', '#304CB2', '#1E3A8A', '#1a2d6d', '50,000 points after $1,000 spend in 3 months', 500)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '50,000 points after $1,000 spend in 3 months', signup_bonus_value = 500;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('chase-southwest-priority', 'southwest', 3, '3x on Southwest purchases'),
('chase-southwest-priority', 'rapid_rewards_partners', 2, '2x on Rapid Rewards hotel and car rental partners'),
('chase-southwest-priority', 'transit', 2, '2x on local transit and commuting'),
('chase-southwest-priority', 'internet_cable_phone', 2, '2x on internet, cable, phone, streaming')
ON CONFLICT DO NOTHING;

-- IHG One Rewards Premier
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('chase-ihg-premier', 'IHG One Rewards Premier', 'Chase', 'mastercard', 99, 3, 'points', '#004E7D', '#003d66', '#002d4d', '140,000 points after $3,000 spend in 3 months', 700)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '140,000 points after $3,000 spend in 3 months', signup_bonus_value = 700;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('chase-ihg-premier', 'ihg', 26, '26x at IHG hotels'),
('chase-ihg-premier', 'travel', 5, '5x on travel, gas, dining'),
('chase-ihg-premier', 'gas', 5, '5x at gas stations'),
('chase-ihg-premier', 'dining', 5, '5x on dining')
ON CONFLICT DO NOTHING;

-- World of Hyatt
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('chase-hyatt', 'World of Hyatt', 'Chase', 'visa', 95, 1, 'points', '#6B5B95', '#5A4A84', '#493973', '60,000 points after $6,000 spend in 6 months', 900)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '60,000 points after $6,000 spend in 6 months', signup_bonus_value = 900;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('chase-hyatt', 'hyatt', 4, '4 points per $1 at Hyatt hotels'),
('chase-hyatt', 'dining', 2, '2 points per $1 on dining'),
('chase-hyatt', 'fitness', 2, '2 points per $1 on gym memberships'),
('chase-hyatt', 'transit', 2, '2 points per $1 on local transit')
ON CONFLICT DO NOTHING;

-- =============================================
-- NO ANNUAL FEE VALUE CARDS
-- =============================================

-- PNC Cash Rewards
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('pnc-cash-rewards', 'Cash Rewards', 'PNC', 'visa', 0, 1, 'cashback', '#F37920', '#E06818', '#C85710', '$200 after $1,000 spend in 3 months', 200)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '$200 after $1,000 spend in 3 months', signup_bonus_value = 200;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('pnc-cash-rewards', 'gas', 4, '4% on gas'),
('pnc-cash-rewards', 'dining', 3, '3% on dining'),
('pnc-cash-rewards', 'grocery', 2, '2% on groceries')
ON CONFLICT DO NOTHING;

-- Navy Federal More Rewards
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('navy-federal-more-rewards', 'More Rewards', 'Navy Federal', 'visa', 0, 1, 'points', '#003B71', '#002d57', '#001f3d', '30,000 points after $3,000 spend in 90 days', 300)
ON CONFLICT (id) DO UPDATE SET signup_bonus = '30,000 points after $3,000 spend in 90 days', signup_bonus_value = 300;

INSERT INTO card_rewards (card_id, category, multiplier, description) VALUES
('navy-federal-more-rewards', 'dining', 3, '3x on dining'),
('navy-federal-more-rewards', 'gas', 2, '2x on gas'),
('navy-federal-more-rewards', 'grocery', 2, '2x on supermarkets'),
('navy-federal-more-rewards', 'transit', 2, '2x on transit')
ON CONFLICT DO NOTHING;

-- USAA Preferred Cash Rewards
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('usaa-preferred-cash', 'Preferred Cash Rewards', 'USAA', 'visa', 0, 1.5, 'cashback', '#00529B', '#00427d', '#00325f', 'No traditional signup bonus', 0)
ON CONFLICT (id) DO UPDATE SET signup_bonus = 'No traditional signup bonus', signup_bonus_value = 0;

-- Alliant Cashback Visa
INSERT INTO cards (id, name, issuer, network, annual_fee, base_reward, reward_type, color, gradient_start, gradient_end, signup_bonus, signup_bonus_value)
VALUES ('alliant-cashback-visa', 'Cashback Visa Signature', 'Alliant Credit Union', 'visa', 0, 2.5, 'cashback', '#003057', '#002544', '#001a31', 'No traditional signup bonus', 0)
ON CONFLICT (id) DO UPDATE SET signup_bonus = 'No traditional signup bonus', signup_bonus_value = 0;

-- =============================================
-- DONE! Full card database loaded.
-- =============================================
