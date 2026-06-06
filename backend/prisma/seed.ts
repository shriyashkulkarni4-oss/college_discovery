import { PrismaClient, OwnershipType, NaacGrade, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const COLLEGE_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
  'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&q=80',
  'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&q=80',
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80',
];

const TOP_RECRUITERS = [
  ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Goldman Sachs'],
  ['Infosys', 'TCS', 'Wipro', 'HCL', 'Cognizant', 'Accenture'],
  ['Flipkart', 'Paytm', 'Ola', 'Swiggy', 'Zomato', 'BYJU\'S'],
  ['IBM', 'Oracle', 'SAP', 'Salesforce', 'Adobe', 'Intel'],
  ['Deloitte', 'EY', 'KPMG', 'McKinsey', 'BCG', 'Bain'],
  ['Samsung', 'LG', 'Qualcomm', 'Texas Instruments', 'Nvidia', 'AMD'],
  ['Tata Motors', 'Mahindra', 'L&T', 'BHEL', 'ONGC', 'ISRO'],
  ['JP Morgan', 'Morgan Stanley', 'Citibank', 'HSBC', 'Barclays', 'Deutsche Bank'],
];

const REVIEW_COMMENTS = [
  'Excellent faculty and world-class infrastructure. The research opportunities here are unparalleled.',
  'Great placement support. The training and development programs prepared me well for industry.',
  'The campus life is vibrant with numerous clubs and cultural activities. Made great friends here.',
  'Strong alumni network that genuinely helps in placements and career guidance.',
  'The curriculum is industry-relevant and frequently updated based on industry feedback.',
  'Labs are well-equipped with latest technology. Hands-on learning is a key strength.',
  'The professors are experienced and always available for doubt clearance. Highly recommended.',
  'Fees are on the higher side but the ROI in terms of placements makes it worth it.',
  'Decent college with good infrastructure. The sports facilities could be better.',
  'Average faculty but excellent peer group. Collaborative learning environment.',
  'The administration is very student-friendly. Issues are resolved promptly.',
  'International collaborations and exchange programs are a big plus.',
  'Research culture is exceptional. Many students have published papers in top journals.',
  'The canteen food is good and affordable. Hostel facilities are comfortable.',
  'Entrepreneurship cell is very active. Many startups have been founded by alumni.',
  'Good balance between academics and extracurricular activities.',
  'Industry internships are well-organized and provide real-world exposure.',
  'The location is great with many tech companies nearby for internships.',
  'Library resources are extensive with access to international journals.',
  'Transportation facilities within the campus are excellent.',
];

interface CollegeData {
  name: string;
  state: string;
  city: string;
  fees: number;
  rating: number;
  ownershipType: OwnershipType;
  naacGrade: NaacGrade;
  establishedYear: number;
  placementAverage: number;
  placementHighest: number;
  description: string;
  topRecruiters: string[];
  imageUrl: string;
}

const collegesData: CollegeData[] = [
  // IITs
  {
    name: 'Indian Institute of Technology Bombay',
    state: 'Maharashtra', city: 'Mumbai',
    fees: 220000, rating: 4.9, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS_PLUS',
    establishedYear: 1958, placementAverage: 2500000, placementHighest: 25000000,
    description: 'IIT Bombay is one of India\'s premier engineering institutions, renowned for cutting-edge research, world-class faculty, and exceptional industry connections. Located in the heart of Mumbai, it offers a vibrant campus life and produces graduates who lead global organizations.',
    topRecruiters: TOP_RECRUITERS[0],
    imageUrl: COLLEGE_IMAGES[0],
  },
  {
    name: 'Indian Institute of Technology Delhi',
    state: 'Delhi', city: 'New Delhi',
    fees: 218000, rating: 4.9, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS_PLUS',
    establishedYear: 1961, placementAverage: 2400000, placementHighest: 22000000,
    description: 'IIT Delhi is a globally recognized institution located in India\'s capital. Known for its excellent research output, distinguished alumni network including Nobel laureates, and strong industry partnerships that ensure exceptional placement outcomes.',
    topRecruiters: TOP_RECRUITERS[0],
    imageUrl: COLLEGE_IMAGES[1],
  },
  {
    name: 'Indian Institute of Technology Madras',
    state: 'Tamil Nadu', city: 'Chennai',
    fees: 215000, rating: 4.8, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS_PLUS',
    establishedYear: 1959, placementAverage: 2350000, placementHighest: 20000000,
    description: 'IIT Madras, a lush green campus in Chennai, consistently ranks among India\'s top institutions. Renowned for entrepreneurship, with the Research Park hosting 200+ startups. Offers an unmatched academic experience with world-class research facilities.',
    topRecruiters: TOP_RECRUITERS[0],
    imageUrl: COLLEGE_IMAGES[2],
  },
  {
    name: 'Indian Institute of Technology Kanpur',
    state: 'Uttar Pradesh', city: 'Kanpur',
    fees: 215000, rating: 4.8, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS_PLUS',
    establishedYear: 1959, placementAverage: 2200000, placementHighest: 19000000,
    description: 'IIT Kanpur is pioneering in CS and technology research. The first institute to offer CS programs in India. Known for its rigorous academic culture, brilliant peer group, and strong connections with global tech companies.',
    topRecruiters: TOP_RECRUITERS[3],
    imageUrl: COLLEGE_IMAGES[3],
  },
  {
    name: 'Indian Institute of Technology Kharagpur',
    state: 'West Bengal', city: 'Kharagpur',
    fees: 212000, rating: 4.8, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS_PLUS',
    establishedYear: 1951, placementAverage: 2100000, placementHighest: 18000000,
    description: 'The oldest IIT and one of the largest technical institutes in India. IIT Kharagpur is known for its 2100-acre campus, diverse academic programs, strong industry relationships, and exceptional alumni network spread across the globe.',
    topRecruiters: TOP_RECRUITERS[4],
    imageUrl: COLLEGE_IMAGES[4],
  },
  {
    name: 'Indian Institute of Technology Roorkee',
    state: 'Uttarakhand', city: 'Roorkee',
    fees: 210000, rating: 4.7, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS_PLUS',
    establishedYear: 1847, placementAverage: 1900000, placementHighest: 15000000,
    description: 'Asia\'s oldest technical institute transformed into an IIT. IIT Roorkee boasts a rich heritage, excellent civil and mechanical engineering programs, and growing prominence in technology and research on the global stage.',
    topRecruiters: TOP_RECRUITERS[6],
    imageUrl: COLLEGE_IMAGES[5],
  },
  {
    name: 'Indian Institute of Technology Guwahati',
    state: 'Assam', city: 'Guwahati',
    fees: 208000, rating: 4.7, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS_PLUS',
    establishedYear: 1994, placementAverage: 1800000, placementHighest: 14000000,
    description: 'Situated on the banks of the Brahmaputra River, IIT Guwahati offers a serene environment for academic excellence. Known for strong CS and engineering programs with growing research output and improving placement records year over year.',
    topRecruiters: TOP_RECRUITERS[1],
    imageUrl: COLLEGE_IMAGES[6],
  },
  {
    name: 'Indian Institute of Technology Hyderabad',
    state: 'Telangana', city: 'Hyderabad',
    fees: 206000, rating: 4.6, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS',
    establishedYear: 2008, placementAverage: 1700000, placementHighest: 13000000,
    description: 'A newer IIT that has quickly established itself as a center of excellence in AI, ML, and emerging technologies. Located in the tech capital of India, IIT Hyderabad benefits from proximity to major technology companies.',
    topRecruiters: TOP_RECRUITERS[0],
    imageUrl: COLLEGE_IMAGES[7],
  },
  // NITs
  {
    name: 'National Institute of Technology Trichy',
    state: 'Tamil Nadu', city: 'Tiruchirappalli',
    fees: 145000, rating: 4.5, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS_PLUS',
    establishedYear: 1964, placementAverage: 1400000, placementHighest: 8000000,
    description: 'NIT Trichy consistently ranks as the top NIT in India. Renowned for its exceptional placement record, strong alumni network, and rigorous academic programs across engineering disciplines.',
    topRecruiters: TOP_RECRUITERS[1],
    imageUrl: COLLEGE_IMAGES[0],
  },
  {
    name: 'National Institute of Technology Warangal',
    state: 'Telangana', city: 'Warangal',
    fees: 142000, rating: 4.4, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS_PLUS',
    establishedYear: 1959, placementAverage: 1300000, placementHighest: 7500000,
    description: 'One of the oldest NITs with a strong tradition of academic excellence. NIT Warangal is known for producing engineers who excel in both core and IT sectors with consistently strong placement statistics.',
    topRecruiters: TOP_RECRUITERS[2],
    imageUrl: COLLEGE_IMAGES[1],
  },
  {
    name: 'National Institute of Technology Surathkal',
    state: 'Karnataka', city: 'Mangalore',
    fees: 140000, rating: 4.4, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS',
    establishedYear: 1960, placementAverage: 1250000, placementHighest: 7000000,
    description: 'NIT Karnataka (Surathkal) offers excellent engineering programs with a scenic coastal campus. Known for strong CS and ECE departments with impressive placement records in IT and core engineering companies.',
    topRecruiters: TOP_RECRUITERS[3],
    imageUrl: COLLEGE_IMAGES[2],
  },
  {
    name: 'National Institute of Technology Calicut',
    state: 'Kerala', city: 'Calicut',
    fees: 138000, rating: 4.3, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS',
    establishedYear: 1961, placementAverage: 1200000, placementHighest: 6500000,
    description: 'NIT Calicut is a premier technical institute in Kerala offering quality education in engineering and technology. The institute has a strong focus on research and maintains excellent ties with the industry.',
    topRecruiters: TOP_RECRUITERS[1],
    imageUrl: COLLEGE_IMAGES[3],
  },
  {
    name: 'National Institute of Technology Rourkela',
    state: 'Odisha', city: 'Rourkela',
    fees: 135000, rating: 4.3, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS',
    establishedYear: 1961, placementAverage: 1150000, placementHighest: 6000000,
    description: 'NIT Rourkela is one of the top technical institutes in Eastern India. Known for its strong metallurgy and core engineering programs alongside rapidly growing CS and IT departments.',
    topRecruiters: TOP_RECRUITERS[6],
    imageUrl: COLLEGE_IMAGES[4],
  },
  // BITS
  {
    name: 'Birla Institute of Technology and Science Pilani',
    state: 'Rajasthan', city: 'Pilani',
    fees: 480000, rating: 4.7, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS_PLUS',
    establishedYear: 1964, placementAverage: 1800000, placementHighest: 16000000,
    description: 'BITS Pilani is India\'s top private engineering institution with a unique dual-degree program. Renowned for its Practice School internship model, autonomous curriculum, and producing leaders in technology and entrepreneurship worldwide.',
    topRecruiters: TOP_RECRUITERS[0],
    imageUrl: COLLEGE_IMAGES[5],
  },
  {
    name: 'Birla Institute of Technology and Science Goa',
    state: 'Goa', city: 'Vasco da Gama',
    fees: 475000, rating: 4.5, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS',
    establishedYear: 2004, placementAverage: 1600000, placementHighest: 12000000,
    description: 'BITS Goa combines the BITS legacy with a beautiful coastal location. Strong in CS, ECE, and engineering disciplines. The Practice School program ensures excellent industry exposure and placement outcomes.',
    topRecruiters: TOP_RECRUITERS[3],
    imageUrl: COLLEGE_IMAGES[6],
  },
  {
    name: 'Birla Institute of Technology and Science Hyderabad',
    state: 'Telangana', city: 'Hyderabad',
    fees: 470000, rating: 4.5, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS',
    establishedYear: 2008, placementAverage: 1550000, placementHighest: 11000000,
    description: 'BITS Hyderabad, the newest BITS campus, benefits from Hyderabad\'s booming tech ecosystem. Offers the same quality education as Pilani with additional opportunities from proximity to major tech companies in the city.',
    topRecruiters: TOP_RECRUITERS[0],
    imageUrl: COLLEGE_IMAGES[7],
  },
  // IIITs
  {
    name: 'International Institute of Information Technology Hyderabad',
    state: 'Telangana', city: 'Hyderabad',
    fees: 280000, rating: 4.6, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS',
    establishedYear: 1998, placementAverage: 1700000, placementHighest: 14000000,
    description: 'IIIT Hyderabad is a premier research institution focused on CS and IT. Known for groundbreaking research in AI, ML, and computer vision. Graduates are highly sought after by top tech companies globally.',
    topRecruiters: TOP_RECRUITERS[0],
    imageUrl: COLLEGE_IMAGES[0],
  },
  {
    name: 'International Institute of Information Technology Bangalore',
    state: 'Karnataka', city: 'Bangalore',
    fees: 275000, rating: 4.5, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS',
    establishedYear: 1999, placementAverage: 1600000, placementHighest: 12000000,
    description: 'Located in India\'s Silicon Valley, IIIT Bangalore offers specialized programs in CS and ECE. Strong industry connections with Bangalore\'s tech ecosystem ensure excellent placement opportunities for graduates.',
    topRecruiters: TOP_RECRUITERS[3],
    imageUrl: COLLEGE_IMAGES[1],
  },
  // VIT
  {
    name: 'Vellore Institute of Technology',
    state: 'Tamil Nadu', city: 'Vellore',
    fees: 195000, rating: 4.3, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS_PLUS',
    establishedYear: 1984, placementAverage: 850000, placementHighest: 5000000,
    description: 'VIT Vellore is one of India\'s largest private universities with over 20,000 students. Known for international collaborations, diverse student community, and consistent placement performance with 800+ companies visiting campus.',
    topRecruiters: TOP_RECRUITERS[1],
    imageUrl: COLLEGE_IMAGES[2],
  },
  {
    name: 'VIT University Chennai',
    state: 'Tamil Nadu', city: 'Chennai',
    fees: 192000, rating: 4.2, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS',
    establishedYear: 2010, placementAverage: 780000, placementHighest: 4500000,
    description: 'VIT Chennai campus combines the VIT brand with the advantage of being located in a major metro city. Strong industry partnerships with Chennai-based companies provide students excellent internship and placement opportunities.',
    topRecruiters: TOP_RECRUITERS[2],
    imageUrl: COLLEGE_IMAGES[3],
  },
  // SRM
  {
    name: 'SRM Institute of Science and Technology',
    state: 'Tamil Nadu', city: 'Kattankulathur',
    fees: 185000, rating: 4.1, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS_PLUS',
    establishedYear: 1985, placementAverage: 750000, placementHighest: 4000000,
    description: 'SRM Institute is one of India\'s top private universities with a sprawling campus near Chennai. Known for strong placement support, international collaborations, and a diverse range of engineering and technology programs.',
    topRecruiters: TOP_RECRUITERS[1],
    imageUrl: COLLEGE_IMAGES[4],
  },
  // Manipal
  {
    name: 'Manipal Institute of Technology',
    state: 'Karnataka', city: 'Manipal',
    fees: 350000, rating: 4.2, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS',
    establishedYear: 1957, placementAverage: 900000, placementHighest: 6000000,
    description: 'Manipal Institute of Technology is a premier private engineering college known for its excellent infrastructure, international collaborations, and consistent placement performance. The scenic campus in coastal Karnataka makes it a popular choice.',
    topRecruiters: TOP_RECRUITERS[3],
    imageUrl: COLLEGE_IMAGES[5],
  },
  // COEP
  {
    name: 'College of Engineering Pune',
    state: 'Maharashtra', city: 'Pune',
    fees: 98000, rating: 4.3, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS',
    establishedYear: 1854, placementAverage: 1000000, placementHighest: 7000000,
    description: 'COEP Pune, one of India\'s oldest engineering colleges established in 1854, offers exceptional value for money. Government-funded with excellent infrastructure, experienced faculty, and strong Pune industry connections.',
    topRecruiters: TOP_RECRUITERS[6],
    imageUrl: COLLEGE_IMAGES[6],
  },
  // MIT-WPU
  {
    name: 'MIT World Peace University',
    state: 'Maharashtra', city: 'Pune',
    fees: 250000, rating: 4.0, ownershipType: 'PRIVATE', naacGrade: 'A',
    establishedYear: 1983, placementAverage: 700000, placementHighest: 4000000,
    description: 'MIT-WPU Pune offers holistic education combining technical excellence with values-based learning. Known for its Industry Linked Curriculum, strong placement support, and a vibrant campus environment in one of India\'s top educational cities.',
    topRecruiters: TOP_RECRUITERS[2],
    imageUrl: COLLEGE_IMAGES[7],
  },
  // More Government Colleges
  {
    name: 'Indian Institute of Technology Patna',
    state: 'Bihar', city: 'Patna',
    fees: 204000, rating: 4.3, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS',
    establishedYear: 2008, placementAverage: 1100000, placementHighest: 6000000,
    description: 'IIT Patna is a growing institution making significant strides in research and academics. Located in Bihar\'s capital, it offers promising career opportunities with a strong foundation in engineering sciences.',
    topRecruiters: TOP_RECRUITERS[1],
    imageUrl: COLLEGE_IMAGES[0],
  },
  {
    name: 'Indian Institute of Technology Bhubaneswar',
    state: 'Odisha', city: 'Bhubaneswar',
    fees: 203000, rating: 4.2, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS',
    establishedYear: 2008, placementAverage: 1050000, placementHighest: 5500000,
    description: 'IIT Bhubaneswar is rapidly developing its academic programs and research capabilities. Located in the Smart City of Bhubaneswar with strong connections to Odisha\'s growing industrial sector.',
    topRecruiters: TOP_RECRUITERS[3],
    imageUrl: COLLEGE_IMAGES[1],
  },
  {
    name: 'National Institute of Technology Kurukshetra',
    state: 'Haryana', city: 'Kurukshetra',
    fees: 132000, rating: 4.1, ownershipType: 'GOVERNMENT', naacGrade: 'A',
    establishedYear: 1963, placementAverage: 950000, placementHighest: 5000000,
    description: 'NIT Kurukshetra is a well-established technical institute in Haryana. Known for its strong engineering programs and proximity to Delhi NCR tech industry, providing excellent internship and placement opportunities.',
    topRecruiters: TOP_RECRUITERS[2],
    imageUrl: COLLEGE_IMAGES[2],
  },
  {
    name: 'National Institute of Technology Jaipur',
    state: 'Rajasthan', city: 'Jaipur',
    fees: 130000, rating: 4.0, ownershipType: 'GOVERNMENT', naacGrade: 'A',
    establishedYear: 1963, placementAverage: 900000, placementHighest: 4800000,
    description: 'Malaviya National Institute of Technology Jaipur is a centrally funded technical institute offering quality education in engineering and technology. Strong connections with Rajasthan\'s growing industrial sector.',
    topRecruiters: TOP_RECRUITERS[4],
    imageUrl: COLLEGE_IMAGES[3],
  },
  {
    name: 'National Institute of Technology Allahabad',
    state: 'Uttar Pradesh', city: 'Prayagraj',
    fees: 128000, rating: 4.0, ownershipType: 'GOVERNMENT', naacGrade: 'A',
    establishedYear: 1961, placementAverage: 880000, placementHighest: 4500000,
    description: 'MNNIT Allahabad is one of the premier engineering institutions in Uttar Pradesh. Known for strong academics, active technical clubs, and solid placement records in IT and core sectors.',
    topRecruiters: TOP_RECRUITERS[1],
    imageUrl: COLLEGE_IMAGES[4],
  },
  {
    name: 'Jadavpur University',
    state: 'West Bengal', city: 'Kolkata',
    fees: 22000, rating: 4.4, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS_PLUS',
    establishedYear: 1905, placementAverage: 950000, placementHighest: 6000000,
    description: 'Jadavpur University is one of India\'s most prestigious public universities offering engineering and humanities programs. Known for exceptional value, brilliant students, and strong research culture.',
    topRecruiters: TOP_RECRUITERS[7],
    imageUrl: COLLEGE_IMAGES[5],
  },
  {
    name: 'PSG College of Technology',
    state: 'Tamil Nadu', city: 'Coimbatore',
    fees: 75000, rating: 4.2, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS',
    establishedYear: 1951, placementAverage: 850000, placementHighest: 5000000,
    description: 'PSG College of Technology Coimbatore is a premier autonomous institution with excellent industry connections. Known for producing skilled engineers for Tamil Nadu\'s manufacturing and IT sectors.',
    topRecruiters: TOP_RECRUITERS[6],
    imageUrl: COLLEGE_IMAGES[6],
  },
  {
    name: 'Thapar Institute of Engineering and Technology',
    state: 'Punjab', city: 'Patiala',
    fees: 225000, rating: 4.2, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS',
    establishedYear: 1956, placementAverage: 900000, placementHighest: 5500000,
    description: 'Thapar Institute is a reputed private engineering institution with strong industry connections in Punjab and across India. Known for quality education, active research programs, and consistent placement performance.',
    topRecruiters: TOP_RECRUITERS[3],
    imageUrl: COLLEGE_IMAGES[7],
  },
  {
    name: 'Amity University Noida',
    state: 'Uttar Pradesh', city: 'Noida',
    fees: 280000, rating: 3.8, ownershipType: 'PRIVATE', naacGrade: 'A',
    establishedYear: 2005, placementAverage: 650000, placementHighest: 3500000,
    description: 'Amity University Noida is a large private university with diverse programs in engineering, management, and sciences. Excellent infrastructure, international collaborations, and proximity to Delhi NCR corporate hub.',
    topRecruiters: TOP_RECRUITERS[2],
    imageUrl: COLLEGE_IMAGES[0],
  },
  {
    name: 'Delhi Technological University',
    state: 'Delhi', city: 'New Delhi',
    fees: 85000, rating: 4.2, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS',
    establishedYear: 1941, placementAverage: 950000, placementHighest: 6000000,
    description: 'Delhi Technological University, formerly Delhi College of Engineering, is one of Delhi\'s premier engineering institutions. Benefits from being in the capital with excellent placement support from Delhi NCR companies.',
    topRecruiters: TOP_RECRUITERS[0],
    imageUrl: COLLEGE_IMAGES[1],
  },
  {
    name: 'Netaji Subhas University of Technology',
    state: 'Delhi', city: 'New Delhi',
    fees: 82000, rating: 4.1, ownershipType: 'GOVERNMENT', naacGrade: 'A',
    establishedYear: 1983, placementAverage: 850000, placementHighest: 5000000,
    description: 'NSUT Delhi offers quality engineering education at affordable government fees. Located in New Delhi with strong placement support from NCR\'s vast tech industry ecosystem.',
    topRecruiters: TOP_RECRUITERS[1],
    imageUrl: COLLEGE_IMAGES[2],
  },
  {
    name: 'PES University',
    state: 'Karnataka', city: 'Bangalore',
    fees: 285000, rating: 4.1, ownershipType: 'PRIVATE', naacGrade: 'A',
    establishedYear: 1988, placementAverage: 850000, placementHighest: 5500000,
    description: 'PES University in Bangalore is known for strong CS and engineering programs with excellent industry connections. Location in Bangalore\'s tech hub provides unmatched access to internships and placements.',
    topRecruiters: TOP_RECRUITERS[0],
    imageUrl: COLLEGE_IMAGES[3],
  },
  {
    name: 'RV College of Engineering',
    state: 'Karnataka', city: 'Bangalore',
    fees: 165000, rating: 4.0, ownershipType: 'PRIVATE', naacGrade: 'A',
    establishedYear: 1963, placementAverage: 750000, placementHighest: 4500000,
    description: 'RV College of Engineering is an autonomous institution in Bangalore known for quality education and consistent placement performance. One of Karnataka\'s oldest and most respected private engineering colleges.',
    topRecruiters: TOP_RECRUITERS[3],
    imageUrl: COLLEGE_IMAGES[4],
  },
  {
    name: 'BMS College of Engineering',
    state: 'Karnataka', city: 'Bangalore',
    fees: 155000, rating: 4.0, ownershipType: 'PRIVATE', naacGrade: 'A',
    establishedYear: 1946, placementAverage: 700000, placementHighest: 4000000,
    description: 'BMS College of Engineering is one of Bangalore\'s oldest private engineering colleges. Offers quality education with strong industry connections and consistent placement support from Bangalore\'s extensive tech ecosystem.',
    topRecruiters: TOP_RECRUITERS[2],
    imageUrl: COLLEGE_IMAGES[5],
  },
  {
    name: 'National Institute of Technology Silchar',
    state: 'Assam', city: 'Silchar',
    fees: 126000, rating: 3.9, ownershipType: 'GOVERNMENT', naacGrade: 'A',
    establishedYear: 1967, placementAverage: 700000, placementHighest: 3800000,
    description: 'NIT Silchar is the premier technical institute in South Assam. Known for quality engineering programs with growing industry connections and improving placement outcomes year over year.',
    topRecruiters: TOP_RECRUITERS[1],
    imageUrl: COLLEGE_IMAGES[6],
  },
  {
    name: 'Kalinga Institute of Industrial Technology',
    state: 'Odisha', city: 'Bhubaneswar',
    fees: 175000, rating: 4.0, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS',
    establishedYear: 1992, placementAverage: 750000, placementHighest: 4500000,
    description: 'KIIT Bhubaneswar is a Deemed University offering world-class facilities and strong placement support. Known for international collaborations and producing industry-ready engineers.',
    topRecruiters: TOP_RECRUITERS[3],
    imageUrl: COLLEGE_IMAGES[7],
  },
  {
    name: 'Lovely Professional University',
    state: 'Punjab', city: 'Phagwara',
    fees: 120000, rating: 3.7, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS',
    establishedYear: 2005, placementAverage: 550000, placementHighest: 3000000,
    description: 'LPU is one of India\'s largest universities by enrollment. Offers diverse engineering and management programs with strong placement support. Known for its modern infrastructure and international student community.',
    topRecruiters: TOP_RECRUITERS[2],
    imageUrl: COLLEGE_IMAGES[0],
  },
  {
    name: 'Chandigarh University',
    state: 'Punjab', city: 'Mohali',
    fees: 115000, rating: 3.8, ownershipType: 'PRIVATE', naacGrade: 'A_PLUS',
    establishedYear: 2012, placementAverage: 580000, placementHighest: 3200000,
    description: 'Chandigarh University has rapidly grown to become one of Punjab\'s leading private universities. Known for strong placement records, international partnerships, and modern facilities near Chandigarh.',
    topRecruiters: TOP_RECRUITERS[1],
    imageUrl: COLLEGE_IMAGES[1],
  },
  {
    name: 'Indian Institute of Technology Indore',
    state: 'Madhya Pradesh', city: 'Indore',
    fees: 205000, rating: 4.4, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS',
    establishedYear: 2009, placementAverage: 1200000, placementHighest: 8000000,
    description: 'IIT Indore is a new-generation IIT showing strong growth in research and academics. Located in Madhya Pradesh\'s commercial capital, it benefits from growing industry connections and improving placement outcomes.',
    topRecruiters: TOP_RECRUITERS[0],
    imageUrl: COLLEGE_IMAGES[2],
  },
  {
    name: 'Indian Institute of Technology Gandhinagar',
    state: 'Gujarat', city: 'Gandhinagar',
    fees: 205000, rating: 4.3, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS',
    establishedYear: 2008, placementAverage: 1150000, placementHighest: 7500000,
    description: 'IIT Gandhinagar is known for its liberal arts approach to engineering education. Located near Ahmedabad, it benefits from Gujarat\'s strong industrial base with excellent placement opportunities.',
    topRecruiters: TOP_RECRUITERS[4],
    imageUrl: COLLEGE_IMAGES[3],
  },
  {
    name: 'National Institute of Technology Karnataka Surathkal',
    state: 'Karnataka', city: 'Surathkal',
    fees: 140000, rating: 4.3, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS',
    establishedYear: 1960, placementAverage: 1100000, placementHighest: 6500000,
    description: 'NITK Surathkal is one of Karnataka\'s premier government engineering institutions. Beautiful coastal campus with excellent academic programs and strong placement support from IT and core engineering companies.',
    topRecruiters: TOP_RECRUITERS[3],
    imageUrl: COLLEGE_IMAGES[4],
  },
  {
    name: 'Symbiosis Institute of Technology',
    state: 'Maharashtra', city: 'Pune',
    fees: 320000, rating: 3.9, ownershipType: 'PRIVATE', naacGrade: 'A',
    establishedYear: 2008, placementAverage: 700000, placementHighest: 4000000,
    description: 'Symbiosis Institute of Technology offers engineering programs as part of the Symbiosis International University. Strong placement support with access to Pune\'s extensive IT and manufacturing industry.',
    topRecruiters: TOP_RECRUITERS[2],
    imageUrl: COLLEGE_IMAGES[5],
  },
  {
    name: 'National Institute of Technology Patna',
    state: 'Bihar', city: 'Patna',
    fees: 125000, rating: 3.9, ownershipType: 'GOVERNMENT', naacGrade: 'A',
    establishedYear: 1886, placementAverage: 720000, placementHighest: 3500000,
    description: 'NIT Patna is one of Bihar\'s oldest and most prestigious engineering institutions. Known for strong core engineering programs and growing IT sector placements in India\'s rapidly developing eastern region.',
    topRecruiters: TOP_RECRUITERS[6],
    imageUrl: COLLEGE_IMAGES[6],
  },
  {
    name: 'Vellore Institute of Technology AP',
    state: 'Andhra Pradesh', city: 'Amaravati',
    fees: 190000, rating: 4.0, ownershipType: 'PRIVATE', naacGrade: 'A',
    establishedYear: 2017, placementAverage: 720000, placementHighest: 4000000,
    description: 'VIT AP is a new campus bringing the VIT brand to Andhra Pradesh. Located in Amaravati, the upcoming capital, it benefits from state government support and growing industry connections in the region.',
    topRecruiters: TOP_RECRUITERS[1],
    imageUrl: COLLEGE_IMAGES[7],
  },
  {
    name: 'Indian Institute of Technology Mandi',
    state: 'Himachal Pradesh', city: 'Mandi',
    fees: 200000, rating: 4.2, ownershipType: 'GOVERNMENT', naacGrade: 'A_PLUS',
    establishedYear: 2009, placementAverage: 1000000, placementHighest: 5500000,
    description: 'IIT Mandi is set against the breathtaking Himalayan backdrop. Known for its unique focus on sustainability, mountain ecology, and developing technologies relevant to hilly terrains alongside strong core engineering programs.',
    topRecruiters: TOP_RECRUITERS[5],
    imageUrl: COLLEGE_IMAGES[0],
  },
];

const COURSES = [
  { courseName: 'B.Tech Computer Science and Engineering', duration: '4 years', feeMultiplier: 1.0 },
  { courseName: 'B.Tech Electronics and Communication Engineering', duration: '4 years', feeMultiplier: 0.95 },
  { courseName: 'B.Tech Mechanical Engineering', duration: '4 years', feeMultiplier: 0.90 },
  { courseName: 'B.Tech Civil Engineering', duration: '4 years', feeMultiplier: 0.85 },
  { courseName: 'B.Tech Electrical Engineering', duration: '4 years', feeMultiplier: 0.92 },
  { courseName: 'B.Tech Chemical Engineering', duration: '4 years', feeMultiplier: 0.88 },
  { courseName: 'B.Tech Information Technology', duration: '4 years', feeMultiplier: 0.97 },
  { courseName: 'B.Tech Data Science and AI', duration: '4 years', feeMultiplier: 1.05 },
  { courseName: 'M.Tech Computer Science', duration: '2 years', feeMultiplier: 0.80 },
  { courseName: 'M.Tech VLSI Design', duration: '2 years', feeMultiplier: 0.75 },
  { courseName: 'MBA Technology Management', duration: '2 years', feeMultiplier: 1.20 },
  { courseName: 'B.Tech Biotechnology', duration: '4 years', feeMultiplier: 0.85 },
  { courseName: 'B.Tech Aerospace Engineering', duration: '4 years', feeMultiplier: 1.10 },
  { courseName: 'Ph.D Computer Science', duration: '5 years', feeMultiplier: 0.50 },
  { courseName: 'B.Tech Production Engineering', duration: '4 years', feeMultiplier: 0.87 },
];

const FIRST_NAMES = [
  'Aarav', 'Arjun', 'Rohan', 'Vikram', 'Kiran', 'Priya', 'Neha', 'Anjali',
  'Suresh', 'Rahul', 'Amit', 'Deepa', 'Pooja', 'Ravi', 'Meera', 'Aisha',
  'Kabir', 'Divya', 'Sachin', 'Nidhi', 'Akash', 'Shreya', 'Nikhil', 'Kavya',
  'Rohit', 'Ishaan', 'Sanya', 'Tanvi', 'Varun', 'Ananya', 'Manish', 'Swati',
  'Gaurav', 'Bhavna', 'Harish', 'Shweta', 'Rajesh', 'Nisha', 'Arun', 'Sonia',
  'Praveen', 'Monika', 'Vishal', 'Rekha', 'Sunil', 'Madhuri', 'Dinesh', 'Lalitha',
  'Girish', 'Usha',
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Mehta', 'Joshi',
  'Nair', 'Reddy', 'Rao', 'Iyer', 'Pillai', 'Menon', 'Bhat', 'Hegde',
  'Kulkarni', 'Desai', 'Shah', 'Trivedi', 'Mishra', 'Pandey', 'Tiwari', 'Sinha',
  'Mukherjee', 'Banerjee', 'Chatterjee', 'Das', 'Roy', 'Bose',
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create admin user
  const adminHash = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Platform Admin',
      email: 'admin@collegediscovery.com',
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Created admin: ${admin.email}`);

  // Create 49 regular users
  const users: { id: string }[] = [];
  for (let i = 0; i < 49; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const hash = await bcrypt.hash('Password@123', 10);
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`,
        passwordHash: hash,
        role: Role.USER,
      },
    });
    users.push({ id: user.id });
  }
  console.log(`✅ Created 49 users`);

  // Create colleges
  const createdColleges: { id: string; fees: number }[] = [];
  const slugCounts: Record<string, number> = {};

  for (const college of collegesData) {
    let baseSlug = slugify(college.name);
    slugCounts[baseSlug] = (slugCounts[baseSlug] || 0) + 1;
    const slug = slugCounts[baseSlug] > 1 ? `${baseSlug}-${slugCounts[baseSlug]}` : baseSlug;

    const created = await prisma.college.create({
      data: {
        name: college.name,
        slug,
        description: college.description,
        state: college.state,
        city: college.city,
        fees: college.fees,
        rating: college.rating,
        ownershipType: college.ownershipType,
        naacGrade: college.naacGrade,
        establishedYear: college.establishedYear,
        placementAverage: college.placementAverage,
        placementHighest: college.placementHighest,
        topRecruiters: college.topRecruiters,
        imageUrl: college.imageUrl,
      },
    });
    createdColleges.push({ id: created.id, fees: college.fees });
  }

  // Add additional colleges to reach ~150 by creating variations
  const additionalColleges = [
    { name: 'National Institute of Technology Hamirpur', state: 'Himachal Pradesh', city: 'Hamirpur', fees: 127000, rating: 3.9, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1986, placementAverage: 680000, placementHighest: 3500000 },
    { name: 'National Institute of Technology Meghalaya', state: 'Meghalaya', city: 'Shillong', fees: 120000, rating: 3.7, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2010, placementAverage: 580000, placementHighest: 2800000 },
    { name: 'National Institute of Technology Manipur', state: 'Manipur', city: 'Imphal', fees: 118000, rating: 3.6, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'B_PLUS_PLUS' as NaacGrade, establishedYear: 2010, placementAverage: 520000, placementHighest: 2500000 },
    { name: 'Anna University', state: 'Tamil Nadu', city: 'Chennai', fees: 55000, rating: 4.1, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS_PLUS' as NaacGrade, establishedYear: 1978, placementAverage: 750000, placementHighest: 4500000 },
    { name: 'Osmania University', state: 'Telangana', city: 'Hyderabad', fees: 45000, rating: 3.9, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1918, placementAverage: 600000, placementHighest: 3000000 },
    { name: 'University Visvesvaraya College of Engineering', state: 'Karnataka', city: 'Bangalore', fees: 35000, rating: 4.0, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1917, placementAverage: 680000, placementHighest: 4000000 },
    { name: 'Government College of Technology Coimbatore', state: 'Tamil Nadu', city: 'Coimbatore', fees: 30000, rating: 3.9, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1945, placementAverage: 600000, placementHighest: 3200000 },
    { name: 'Thiagarajar College of Engineering', state: 'Tamil Nadu', city: 'Madurai', fees: 65000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1957, placementAverage: 580000, placementHighest: 3000000 },
    { name: 'Kongu Engineering College', state: 'Tamil Nadu', city: 'Erode', fees: 70000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1983, placementAverage: 520000, placementHighest: 2800000 },
    { name: 'Sri Venkateswara College of Engineering', state: 'Tamil Nadu', city: 'Sriperumbudur', fees: 72000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1985, placementAverage: 550000, placementHighest: 3000000 },
    { name: 'Heritage Institute of Technology', state: 'West Bengal', city: 'Kolkata', fees: 88000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1999, placementAverage: 500000, placementHighest: 2800000 },
    { name: 'Institute of Engineering and Management', state: 'West Bengal', city: 'Kolkata', fees: 82000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1989, placementAverage: 520000, placementHighest: 2900000 },
    { name: 'Techno India University', state: 'West Bengal', city: 'Kolkata', fees: 78000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'B_PLUS_PLUS' as NaacGrade, establishedYear: 2012, placementAverage: 450000, placementHighest: 2500000 },
    { name: 'Pune Institute of Computer Technology', state: 'Maharashtra', city: 'Pune', fees: 125000, rating: 4.0, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1983, placementAverage: 720000, placementHighest: 4200000 },
    { name: 'Dwarkadas J. Sanghvi College of Engineering', state: 'Maharashtra', city: 'Mumbai', fees: 130000, rating: 3.9, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1994, placementAverage: 680000, placementHighest: 4000000 },
    { name: 'K J Somaiya College of Engineering', state: 'Maharashtra', city: 'Mumbai', fees: 135000, rating: 3.9, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1983, placementAverage: 700000, placementHighest: 4200000 },
    { name: 'Veermata Jijabai Technological Institute', state: 'Maharashtra', city: 'Mumbai', fees: 60000, rating: 4.1, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1887, placementAverage: 780000, placementHighest: 5000000 },
    { name: 'Walchand College of Engineering', state: 'Maharashtra', city: 'Sangli', fees: 65000, rating: 4.0, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1947, placementAverage: 650000, placementHighest: 3800000 },
    { name: 'Dr. Babasaheb Ambedkar Technological University', state: 'Maharashtra', city: 'Lonere', fees: 42000, rating: 3.8, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1989, placementAverage: 550000, placementHighest: 3000000 },
    { name: 'National Institute of Technology Goa', state: 'Goa', city: 'Farmagudi', fees: 123000, rating: 3.9, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2010, placementAverage: 650000, placementHighest: 3500000 },
    { name: 'Goa College of Engineering', state: 'Goa', city: 'Ponda', fees: 55000, rating: 3.8, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1986, placementAverage: 580000, placementHighest: 3200000 },
    { name: 'SRM University AP', state: 'Andhra Pradesh', city: 'Amaravati', fees: 180000, rating: 3.9, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2017, placementAverage: 650000, placementHighest: 3500000 },
    { name: 'Vignan University', state: 'Andhra Pradesh', city: 'Guntur', fees: 115000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2008, placementAverage: 520000, placementHighest: 2800000 },
    { name: 'Gayatri Vidya Parishad College of Engineering', state: 'Andhra Pradesh', city: 'Visakhapatnam', fees: 85000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1997, placementAverage: 500000, placementHighest: 2700000 },
    { name: 'Andhra University College of Engineering', state: 'Andhra Pradesh', city: 'Visakhapatnam', fees: 40000, rating: 3.9, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1935, placementAverage: 600000, placementHighest: 3500000 },
    { name: 'Sri Sivasubramaniya Nadar College of Engineering', state: 'Tamil Nadu', city: 'Chennai', fees: 90000, rating: 4.0, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1996, placementAverage: 680000, placementHighest: 4000000 },
    { name: 'Bannari Amman Institute of Technology', state: 'Tamil Nadu', city: 'Sathyamangalam', fees: 68000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1996, placementAverage: 480000, placementHighest: 2600000 },
    { name: 'Kumaraguru College of Technology', state: 'Tamil Nadu', city: 'Coimbatore', fees: 72000, rating: 3.9, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1984, placementAverage: 580000, placementHighest: 3200000 },
    { name: 'Sri Krishna College of Engineering', state: 'Tamil Nadu', city: 'Coimbatore', fees: 67000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1998, placementAverage: 470000, placementHighest: 2500000 },
    { name: 'Mepco Schlenk Engineering College', state: 'Tamil Nadu', city: 'Sivakasi', fees: 60000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1984, placementAverage: 510000, placementHighest: 2800000 },
    { name: 'Karunya Institute of Technology', state: 'Tamil Nadu', city: 'Coimbatore', fees: 105000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1986, placementAverage: 530000, placementHighest: 2900000 },
    { name: 'SRM Easwari Engineering College', state: 'Tamil Nadu', city: 'Chennai', fees: 80000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1996, placementAverage: 490000, placementHighest: 2700000 },
    { name: 'Dr. MGR Educational and Research Institute', state: 'Tamil Nadu', city: 'Chennai', fees: 85000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1988, placementAverage: 460000, placementHighest: 2500000 },
    { name: 'Maharshi Dayanand University', state: 'Haryana', city: 'Rohtak', fees: 38000, rating: 3.7, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1976, placementAverage: 480000, placementHighest: 2600000 },
    { name: 'Guru Gobind Singh Indraprastha University', state: 'Delhi', city: 'New Delhi', fees: 75000, rating: 3.8, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1998, placementAverage: 550000, placementHighest: 3000000 },
    { name: 'University of Petroleum and Energy Studies', state: 'Uttarakhand', city: 'Dehradun', fees: 245000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2003, placementAverage: 620000, placementHighest: 3500000 },
    { name: 'Graphic Era University', state: 'Uttarakhand', city: 'Dehradun', fees: 135000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1993, placementAverage: 500000, placementHighest: 2800000 },
    { name: 'Shri Mata Vaishno Devi University', state: 'Jammu and Kashmir', city: 'Katra', fees: 92000, rating: 3.9, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1999, placementAverage: 580000, placementHighest: 3200000 },
    { name: 'National Institute of Technology Srinagar', state: 'Jammu and Kashmir', city: 'Srinagar', fees: 119000, rating: 3.8, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1960, placementAverage: 600000, placementHighest: 3300000 },
    { name: 'Rajiv Gandhi Institute of Petroleum Technology', state: 'Uttar Pradesh', city: 'Amethi', fees: 115000, rating: 4.0, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 2008, placementAverage: 900000, placementHighest: 5500000 },
    { name: 'ABV-Indian Institute of Information Technology and Management Gwalior', state: 'Madhya Pradesh', city: 'Gwalior', fees: 155000, rating: 4.1, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1997, placementAverage: 950000, placementHighest: 6000000 },
    { name: 'Indira Gandhi Delhi Technical University for Women', state: 'Delhi', city: 'New Delhi', fees: 72000, rating: 3.9, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1998, placementAverage: 620000, placementHighest: 3500000 },
    { name: 'Jaypee Institute of Information Technology', state: 'Uttar Pradesh', city: 'Noida', fees: 198000, rating: 3.9, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2001, placementAverage: 680000, placementHighest: 4000000 },
    { name: 'Bennett University', state: 'Uttar Pradesh', city: 'Greater Noida', fees: 295000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2016, placementAverage: 650000, placementHighest: 3800000 },
    { name: 'BML Munjal University', state: 'Haryana', city: 'Gurugram', fees: 320000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2014, placementAverage: 580000, placementHighest: 3500000 },
    { name: 'Sharda University', state: 'Uttar Pradesh', city: 'Greater Noida', fees: 168000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2009, placementAverage: 520000, placementHighest: 2900000 },
    { name: 'GD Goenka University', state: 'Haryana', city: 'Gurugram', fees: 285000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'B_PLUS_PLUS' as NaacGrade, establishedYear: 2013, placementAverage: 480000, placementHighest: 2700000 },
    { name: 'Chitkara University', state: 'Punjab', city: 'Rajpura', fees: 148000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2010, placementAverage: 550000, placementHighest: 3100000 },
    { name: 'Marwadi University', state: 'Gujarat', city: 'Rajkot', fees: 125000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2016, placementAverage: 490000, placementHighest: 2700000 },
    { name: 'Nirma University', state: 'Gujarat', city: 'Ahmedabad', fees: 195000, rating: 4.0, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 2003, placementAverage: 750000, placementHighest: 4500000 },
    { name: 'Dhirubhai Ambani Institute of ICT', state: 'Gujarat', city: 'Gandhinagar', fees: 280000, rating: 4.1, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 2001, placementAverage: 900000, placementHighest: 6000000 },
    { name: 'Pandit Deendayal Energy University', state: 'Gujarat', city: 'Gandhinagar', fees: 165000, rating: 3.9, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2007, placementAverage: 680000, placementHighest: 4000000 },
    { name: 'Silver Oak University', state: 'Gujarat', city: 'Ahmedabad', fees: 115000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'B_PLUS_PLUS' as NaacGrade, establishedYear: 2018, placementAverage: 430000, placementHighest: 2400000 },
    { name: 'Sardar Vallabhbhai National Institute of Technology', state: 'Gujarat', city: 'Surat', fees: 132000, rating: 4.0, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1961, placementAverage: 780000, placementHighest: 4800000 },
    { name: 'L.D. College of Engineering', state: 'Gujarat', city: 'Ahmedabad', fees: 48000, rating: 3.9, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1948, placementAverage: 620000, placementHighest: 3500000 },
    { name: 'Maulana Azad National Institute of Technology Bhopal', state: 'Madhya Pradesh', city: 'Bhopal', fees: 130000, rating: 4.0, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1960, placementAverage: 780000, placementHighest: 4500000 },
    { name: 'Shri Govindram Seksaria Institute of Technology', state: 'Madhya Pradesh', city: 'Indore', fees: 55000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1952, placementAverage: 550000, placementHighest: 3200000 },
    { name: 'Acropolis Institute of Technology and Research', state: 'Madhya Pradesh', city: 'Indore', fees: 88000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'B_PLUS_PLUS' as NaacGrade, establishedYear: 2004, placementAverage: 430000, placementHighest: 2400000 },
    { name: 'JSS Academy of Technical Education', state: 'Karnataka', city: 'Noida', fees: 142000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1998, placementAverage: 560000, placementHighest: 3100000 },
    { name: 'New Horizon College of Engineering', state: 'Karnataka', city: 'Bangalore', fees: 145000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1999, placementAverage: 520000, placementHighest: 2900000 },
    { name: 'Nitte Meenakshi Institute of Technology', state: 'Karnataka', city: 'Bangalore', fees: 148000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2001, placementAverage: 500000, placementHighest: 2800000 },
    { name: 'CMR Institute of Technology', state: 'Karnataka', city: 'Bangalore', fees: 138000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2000, placementAverage: 480000, placementHighest: 2700000 },
    { name: 'Oxford College of Engineering', state: 'Karnataka', city: 'Bangalore', fees: 125000, rating: 3.5, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'B_PLUS_PLUS' as NaacGrade, establishedYear: 1994, placementAverage: 420000, placementHighest: 2300000 },
    { name: 'Dayananda Sagar College of Engineering', state: 'Karnataka', city: 'Bangalore', fees: 145000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1979, placementAverage: 560000, placementHighest: 3100000 },
    { name: 'M S Ramaiah Institute of Technology', state: 'Karnataka', city: 'Bangalore', fees: 158000, rating: 4.0, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1962, placementAverage: 700000, placementHighest: 4200000 },
    { name: 'Sri Jayachamarajendra College of Engineering', state: 'Karnataka', city: 'Mysuru', fees: 42000, rating: 3.9, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1963, placementAverage: 560000, placementHighest: 3200000 },
    { name: 'Malnad College of Engineering', state: 'Karnataka', city: 'Hassan', fees: 40000, rating: 3.8, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1960, placementAverage: 520000, placementHighest: 3000000 },
    { name: 'National Institute of Technology Andhra Pradesh', state: 'Andhra Pradesh', city: 'Tadepalligudem', fees: 122000, rating: 3.8, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2015, placementAverage: 620000, placementHighest: 3500000 },
    { name: 'GITAM Institute of Technology', state: 'Andhra Pradesh', city: 'Visakhapatnam', fees: 165000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1980, placementAverage: 580000, placementHighest: 3300000 },
    { name: 'KL University', state: 'Andhra Pradesh', city: 'Vaddeswaram', fees: 145000, rating: 3.9, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1980, placementAverage: 650000, placementHighest: 3800000 },
    { name: 'Presidency University Bangalore', state: 'Karnataka', city: 'Bangalore', fees: 175000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2013, placementAverage: 520000, placementHighest: 2900000 },
    { name: 'Woxsen University', state: 'Telangana', city: 'Hyderabad', fees: 380000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2014, placementAverage: 680000, placementHighest: 4000000 },
    { name: 'Mahindra University', state: 'Telangana', city: 'Hyderabad', fees: 295000, rating: 3.9, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2020, placementAverage: 750000, placementHighest: 4500000 },
    { name: 'Anurag University', state: 'Telangana', city: 'Hyderabad', fees: 125000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2008, placementAverage: 490000, placementHighest: 2700000 },
    { name: 'CMR Engineering College', state: 'Telangana', city: 'Hyderabad', fees: 118000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'B_PLUS_PLUS' as NaacGrade, establishedYear: 2002, placementAverage: 450000, placementHighest: 2500000 },
    { name: 'Osmania University College of Engineering', state: 'Telangana', city: 'Hyderabad', fees: 38000, rating: 4.0, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1929, placementAverage: 620000, placementHighest: 3500000 },
    { name: 'College of Engineering Bhubaneswar', state: 'Odisha', city: 'Bhubaneswar', fees: 52000, rating: 3.7, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1981, placementAverage: 480000, placementHighest: 2700000 },
    { name: 'Centurion University of Technology', state: 'Odisha', city: 'Bhubaneswar', fees: 98000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2010, placementAverage: 420000, placementHighest: 2400000 },
    { name: 'Silicon Institute of Technology', state: 'Odisha', city: 'Bhubaneswar', fees: 88000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'B_PLUS_PLUS' as NaacGrade, establishedYear: 2001, placementAverage: 400000, placementHighest: 2200000 },
    { name: 'Amrita School of Engineering', state: 'Tamil Nadu', city: 'Coimbatore', fees: 195000, rating: 4.1, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS_PLUS' as NaacGrade, establishedYear: 2003, placementAverage: 780000, placementHighest: 5000000 },
    { name: 'Amrita School of Engineering Bengaluru', state: 'Karnataka', city: 'Bangalore', fees: 195000, rating: 4.0, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS_PLUS' as NaacGrade, establishedYear: 2004, placementAverage: 750000, placementHighest: 4800000 },
    { name: 'Dr. D Y Patil Institute of Technology', state: 'Maharashtra', city: 'Pune', fees: 155000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2002, placementAverage: 520000, placementHighest: 3000000 },
    { name: 'Indore Institute of Science and Technology', state: 'Madhya Pradesh', city: 'Indore', fees: 82000, rating: 3.5, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'B_PLUS_PLUS' as NaacGrade, establishedYear: 2004, placementAverage: 390000, placementHighest: 2200000 },
    { name: 'Sathyabama Institute of Science and Technology', state: 'Tamil Nadu', city: 'Chennai', fees: 120000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1987, placementAverage: 580000, placementHighest: 3200000 },
    { name: 'Jerusalem College of Engineering', state: 'Tamil Nadu', city: 'Chennai', fees: 78000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1996, placementAverage: 450000, placementHighest: 2500000 },
    { name: 'Karpagam Academy of Higher Education', state: 'Tamil Nadu', city: 'Coimbatore', fees: 85000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2008, placementAverage: 480000, placementHighest: 2700000 },
    { name: 'Rajalakshmi Engineering College', state: 'Tamil Nadu', city: 'Chennai', fees: 82000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1997, placementAverage: 490000, placementHighest: 2700000 },
    { name: 'Vivekananda College of Engineering and Technology', state: 'Tamil Nadu', city: 'Namakkal', fees: 60000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1984, placementAverage: 420000, placementHighest: 2400000 },
    { name: 'St. Joseph College of Engineering', state: 'Tamil Nadu', city: 'Chennai', fees: 88000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1994, placementAverage: 560000, placementHighest: 3200000 },
    { name: 'Hindustan Institute of Technology and Science', state: 'Tamil Nadu', city: 'Chennai', fees: 130000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1985, placementAverage: 490000, placementHighest: 2800000 },
    { name: 'Vels Institute of Science Technology and Advanced Studies', state: 'Tamil Nadu', city: 'Chennai', fees: 92000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2008, placementAverage: 440000, placementHighest: 2500000 },
    { name: 'National Engineering College', state: 'Tamil Nadu', city: 'Kovilpatti', fees: 62000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1984, placementAverage: 520000, placementHighest: 2900000 },
    { name: 'Cape Institute of Technology', state: 'Tamil Nadu', city: 'Tirunelveli', fees: 55000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2000, placementAverage: 400000, placementHighest: 2300000 },
    { name: 'Veltech Rangarajan Dr Sagunthala R&D Institute', state: 'Tamil Nadu', city: 'Chennai', fees: 105000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1997, placementAverage: 500000, placementHighest: 2800000 },
    { name: 'Sri Ramakrishna Engineering College', state: 'Tamil Nadu', city: 'Coimbatore', fees: 72000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1994, placementAverage: 540000, placementHighest: 3000000 },
    { name: 'Saveetha Institute of Medical and Technical Sciences', state: 'Tamil Nadu', city: 'Chennai', fees: 138000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1988, placementAverage: 500000, placementHighest: 2900000 },
    { name: 'Coimbatore Institute of Technology', state: 'Tamil Nadu', city: 'Coimbatore', fees: 45000, rating: 3.9, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1956, placementAverage: 600000, placementHighest: 3500000 },
    { name: 'Government College of Engineering Tirunelveli', state: 'Tamil Nadu', city: 'Tirunelveli', fees: 28000, rating: 3.8, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1986, placementAverage: 520000, placementHighest: 3000000 },
    { name: 'National Institute of Technology Tiruchirappalli', state: 'Tamil Nadu', city: 'Tiruchirappalli', fees: 145000, rating: 4.6, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS_PLUS' as NaacGrade, establishedYear: 1964, placementAverage: 1500000, placementHighest: 9000000 },
    { name: 'Sri Eshwar College of Engineering', state: 'Tamil Nadu', city: 'Coimbatore', fees: 68000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2004, placementAverage: 470000, placementHighest: 2600000 },
    { name: 'KPR Institute of Engineering and Technology', state: 'Tamil Nadu', city: 'Coimbatore', fees: 70000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2004, placementAverage: 490000, placementHighest: 2700000 },
    { name: 'Sree Vidyanikethan Engineering College', state: 'Andhra Pradesh', city: 'Tirupati', fees: 88000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2003, placementAverage: 440000, placementHighest: 2400000 },
    { name: 'RMK Engineering College', state: 'Tamil Nadu', city: 'Chennai', fees: 82000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1993, placementAverage: 530000, placementHighest: 3000000 },
    { name: 'Sri Venkateswara University College of Engineering', state: 'Andhra Pradesh', city: 'Tirupati', fees: 35000, rating: 3.9, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 1958, placementAverage: 560000, placementHighest: 3200000 },
    { name: 'Christ University Faculty of Engineering', state: 'Karnataka', city: 'Bangalore', fees: 195000, rating: 3.8, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2008, placementAverage: 580000, placementHighest: 3300000 },
    { name: 'Acharya Institute of Technology', state: 'Karnataka', city: 'Bangalore', fees: 140000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2000, placementAverage: 490000, placementHighest: 2800000 },
    { name: 'East West Institute of Technology', state: 'Karnataka', city: 'Bangalore', fees: 128000, rating: 3.6, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'B_PLUS_PLUS' as NaacGrade, establishedYear: 2001, placementAverage: 430000, placementHighest: 2400000 },
    { name: 'Global Academy of Technology', state: 'Karnataka', city: 'Bangalore', fees: 132000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2001, placementAverage: 470000, placementHighest: 2600000 },
    { name: 'Cambridge Institute of Technology', state: 'Karnataka', city: 'Bangalore', fees: 135000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2000, placementAverage: 460000, placementHighest: 2600000 },
    { name: 'Reva University', state: 'Karnataka', city: 'Bangalore', fees: 165000, rating: 3.7, ownershipType: 'PRIVATE' as OwnershipType, naacGrade: 'A' as NaacGrade, establishedYear: 2012, placementAverage: 480000, placementHighest: 2700000 },
    { name: 'Indian Institute of Technology Jodhpur', state: 'Rajasthan', city: 'Jodhpur', fees: 203000, rating: 4.3, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 2008, placementAverage: 1050000, placementHighest: 5500000 },
    { name: 'Indian Institute of Technology Tirupati', state: 'Andhra Pradesh', city: 'Tirupati', fees: 200000, rating: 4.2, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 2015, placementAverage: 950000, placementHighest: 5000000 },
    { name: 'Indian Institute of Technology Palakkad', state: 'Kerala', city: 'Palakkad', fees: 200000, rating: 4.2, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 2015, placementAverage: 950000, placementHighest: 4800000 },
    { name: 'Indian Institute of Technology Ropar', state: 'Punjab', city: 'Rupnagar', fees: 201000, rating: 4.2, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 2008, placementAverage: 980000, placementHighest: 5200000 },
    { name: 'Indian Institute of Technology Dharwad', state: 'Karnataka', city: 'Dharwad', fees: 199000, rating: 4.1, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 2016, placementAverage: 900000, placementHighest: 4800000 },
    { name: 'Indian Institute of Technology Bhilai', state: 'Chhattisgarh', city: 'Bhilai', fees: 198000, rating: 4.1, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 2016, placementAverage: 880000, placementHighest: 4500000 },
    { name: 'Indian Institute of Technology Jammu', state: 'Jammu and Kashmir', city: 'Jammu', fees: 197000, rating: 4.1, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 2016, placementAverage: 850000, placementHighest: 4500000 },
    { name: 'Indian Institute of Technology Varanasi (IIT BHU)', state: 'Uttar Pradesh', city: 'Varanasi', fees: 210000, rating: 4.5, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS_PLUS' as NaacGrade, establishedYear: 1919, placementAverage: 1500000, placementHighest: 12000000 },
    { name: 'Indian Institute of Technology ISM Dhanbad', state: 'Jharkhand', city: 'Dhanbad', fees: 208000, rating: 4.3, ownershipType: 'GOVERNMENT' as OwnershipType, naacGrade: 'A_PLUS' as NaacGrade, establishedYear: 1926, placementAverage: 1200000, placementHighest: 8000000 },
  ];

  for (const college of additionalColleges) {
    let baseSlug = slugify(college.name);
    slugCounts[baseSlug] = (slugCounts[baseSlug] || 0) + 1;
    const slug = slugCounts[baseSlug] > 1 ? `${baseSlug}-${slugCounts[baseSlug]}` : baseSlug;
    const imageUrl = COLLEGE_IMAGES[Math.floor(Math.random() * COLLEGE_IMAGES.length)];
    const recruiterSet = TOP_RECRUITERS[Math.floor(Math.random() * TOP_RECRUITERS.length)];
    const desc = `${college.name} is a prestigious institution located in ${college.city}, ${college.state}. ${college.ownershipType === 'GOVERNMENT' ? 'As a government-funded institution, it offers quality education at affordable fees.' : 'As a premier private institution, it offers state-of-the-art facilities and industry-aligned curriculum.'} With an establishment year of ${college.establishedYear}, it has a rich heritage of producing skilled graduates.`;

    const created = await prisma.college.create({
      data: {
        name: college.name,
        slug,
        description: desc,
        state: college.state,
        city: college.city,
        fees: college.fees,
        rating: college.rating,
        ownershipType: college.ownershipType,
        naacGrade: college.naacGrade,
        establishedYear: college.establishedYear,
        placementAverage: college.placementAverage,
        placementHighest: college.placementHighest,
        topRecruiters: recruiterSet,
        imageUrl,
      },
    });
    createdColleges.push({ id: created.id, fees: college.fees });
  }

  console.log(`✅ Created ${createdColleges.length} colleges`);

  // Create courses (3-5 per college)
  let totalCourses = 0;
  for (const college of createdColleges) {
    const numCourses = 3 + Math.floor(Math.random() * 3); // 3-5 courses per college
    const shuffled = [...COURSES].sort(() => Math.random() - 0.5).slice(0, numCourses);
    for (const course of shuffled) {
      await prisma.course.create({
        data: {
          collegeId: college.id,
          courseName: course.courseName,
          duration: course.duration,
          fees: Math.round(college.fees * course.feeMultiplier),
        },
      });
      totalCourses++;
    }
  }
  console.log(`✅ Created ${totalCourses} courses`);

  // Create reviews (5-8 per college, ~1000 total)
  let totalReviews = 0;
  const allUserIds = [admin.id, ...users.map((u) => u.id)];

  for (const college of createdColleges) {
    const numReviews = 5 + Math.floor(Math.random() * 4); // 5-8 reviews per college
    const shuffledUsers = [...allUserIds].sort(() => Math.random() - 0.5).slice(0, numReviews);

    for (const userId of shuffledUsers) {
      const rating = Math.max(1, Math.min(5, Math.round(3 + Math.random() * 2)));
      const comment = REVIEW_COMMENTS[Math.floor(Math.random() * REVIEW_COMMENTS.length)];
      try {
        await prisma.review.create({
          data: {
            collegeId: college.id,
            userId,
            rating,
            comment,
          },
        });
        totalReviews++;
      } catch (e) {
        // Skip if unique constraint violated
      }
    }
  }
  console.log(`✅ Created ${totalReviews} reviews`);

  // Create saved colleges (5-10 per user)
  for (const user of users.slice(0, 30)) {
    const numSaved = 5 + Math.floor(Math.random() * 6);
    const shuffledColleges = [...createdColleges].sort(() => Math.random() - 0.5).slice(0, numSaved);
    for (const college of shuffledColleges) {
      try {
        await prisma.savedCollege.create({
          data: { userId: user.id, collegeId: college.id },
        });
      } catch (e) {
        // Skip duplicates
      }
    }
  }
  console.log(`✅ Created saved colleges`);

  console.log('\n🎉 Seed complete!');
  console.log(`📊 Summary:`);
  console.log(`   - Colleges: ${createdColleges.length}`);
  console.log(`   - Courses: ${totalCourses}`);
  console.log(`   - Reviews: ${totalReviews}`);
  console.log(`   - Users: 50 (1 admin + 49 regular)`);
  console.log(`\n🔐 Admin credentials:`);
  console.log(`   Email: admin@collegediscovery.com`);
  console.log(`   Password: Admin@123`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
