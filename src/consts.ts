// 연구실 전역 정보 (출처: https://sites.google.com/view/rv-lab)

export const SITE_TITLE = 'RV LAB';
export const SITE_DESCRIPTION =
	'경기대학교 전자공학부 RV LAB — 자율주행과 휴머노이드를 연구하는 Robotics and Vision Lab.';

export const LAB = {
	name: 'RV LAB',
	fullName: 'Robotics and Vision Lab.',
	university: '경기대학교 전자공학부',
	email: 'minseongchoi@kyonggi.ac.kr',
	youtube: 'https://www.youtube.com/@RVLAB-UNIV',
	googleSite: 'https://sites.google.com/view/rv-lab',
	recruiting: true,
	recruitNotice:
		"('26.03.15) 현재 학부연구생이 많아, 대학원(타교/자교) 진학을 생각하는 학생만 지도 가능합니다.",
};

// 한 페이지에 보여줄 항목 수
export const NEWS_PAGE_SIZE = 6;
export const PUBLICATIONS_PAGE_SIZE = 8;

// 논문 저자 중 굵게 표시할 연구실 구성원 이름
export const LAB_AUTHORS = [
	'Minseong Choi',
	'최민성',
	'Gangmin Yu',
	'Chulju Park',
	'Jungyu Kim',
	'Minjun Sung',
	'김도윤',
	'강민수',
	'김준규',
	'유상준',
	'이다민',
	'김도연',
	'강근영',
	'이충헌',
	'유강민',
	'성민준',
	'왕석빈',
	'임민창',
	'윤정우',
	'김형래',
	'박철주',
];

export const PUBLICATION_CATEGORIES = [
	{ key: 'intl-journal', label: '국제 저널', en: 'International Journals' },
	{ key: 'intl-conference', label: '국제 학회', en: 'International Conferences' },
	{ key: 'domestic-journal', label: '국내 저널', en: 'Domestic Journals' },
	{ key: 'domestic-conference', label: '국내 학회', en: 'Domestic Conferences' },
] as const;

export type ResearchTopic = {
	title: string;
	summary: string;
	video?: string; // YouTube video id
	paper: string;
	status?: string;
};

// 두 축의 연구 분야 + 대표 연구 (홈 화면의 연구 하이라이트)
export const RESEARCH_PILLARS: {
	id: string;
	icon: string;
	title: string;
	titleEn: string;
	summary: string;
	keywords: string[];
	video?: string;
	topics: ResearchTopic[];
}[] = [
	{
		id: 'humanoids',
		icon: '🤖',
		title: '휴머노이드 · Physical AI',
		titleEn: 'Humanoids',
		summary:
			'IsaacSim 디지털 트윈 시뮬레이터를 기반으로 Vision Language Action(VLA), Imitation Learning, Vision Language Navigation(VLN) 같은 AI 기술을 접목해 실제 하드웨어에 적용합니다.',
		keywords: ['VLA', 'Imitation Learning', 'VLN', 'Sim2Real', 'IsaacSim Digital Twin', 'Biped Walking'],
		video: 'BRZAsonkIPI',
		topics: [
			{
				title: 'Biped Walking',
				summary: '공압 하이브리드 구동 기반의 저구속 이족 보행 로봇 PHAER',
				video: 'RgJKCju_IRQ',
				paper:
					'Donghyun Kim, Yun-Pyo Hong, Hyung-Tae Seo, Minseong Choi† and Kyung-Soo Kim†. "PHAER: Pneumatic Hybrid Actuated Efficient Robot With Under-Constrained Biped Walking", IEEE Transactions on Mechatronics, 2026.',
				status: 'Under Review',
			},
			{
				title: 'Physical AI',
				summary: 'IsaacSim 기반 VR 원격조작으로 휴머노이드 ACT 정책을 학습하고 Jitter를 저감',
				video: 'mruXADdMVBY',
				paper:
					'김도윤, 강민수, 유강민, 서형태, 박영상†, 최민성†. "IsaacSim 기반 휴머노이드 ACT 학습제어를 위한 VR 원격조작 및 Jitter 저감 기법", 제어로봇시스템학회(ICROS), 2026.',
			},
			{
				title: 'Imitation Learning',
				summary: '센서리스 힘 추정과 비전 기반 제어 전환으로 로봇 정육 절단을 모방학습',
				video: 'w7S2G6j_feM',
				paper:
					'Sangjun Yu*, Jungyu Kim*, Minjun Sung, Kyounghun Lee, Jeonghun Kim, Hyung-Tae Seo† and Minseong Choi†. "Vision-Based Control Switching with Sensorless Force Estimation for Robotic Meat Cutting via Imitation Learning", Sensors, 2026.',
				status: 'Under Review',
			},
		],
	},
	{
		id: 'autonomous-driving',
		icon: '🚗',
		title: '자율주행 인지',
		titleEn: 'Autonomous Driving',
		summary:
			'Simultaneous Localization And Mapping(SLAM), Road Marking Segmentation, Camera-4D Radar 기반 Object Detection 같은 자율주행 인지 기술을 연구합니다.',
		keywords: ['Vector Map SLAM', '4D Radar', 'Sensor Fusion', 'Road Marking Segmentation', 'Vehicle Pose Estimation'],
		video: 'ySjc261NPDk',
		topics: [
			{
				title: 'Vector Map SLAM',
				summary: '동적 객체 제거 마스크와 2단계 루프 검출을 이용한 4D Radar-Camera 벡터맵 SLAM',
				video: 'MEGpB7BKaMY',
				paper:
					'Minseong Choi et al. "4D Radar-Camera Based Vector Map SLAM Using Dynamic Object Removal Mask with Two-Stage Loop Detection", IEEE Transactions on Instrumentation and Measurement, 2026.',
			},
			{
				title: 'Semantic Segmentation',
				summary: '노이즈가 섞인 라벨에서도 강건한 불확실성 보호 증류 기반 노면표시 분할',
				video: 'ytoQFS1PsT8',
				paper:
					'Seunghoon Yang*, Minseong Choi*, Yeong Sang Park, Keun-Ha Choi and Kyung-Soo Kim. "UPRuNA: Uncertainty-Protected Distillation for Road Marking Segmentation under Noisy Annotations", IEEE Transactions on Intelligent Transportation Systems, 2026.',
				status: 'Under Review',
			},
			{
				title: 'Vehicle Pose Estimation',
				summary: '번호판 정보와 4D Radar 융합으로 단안 카메라 3D 차량 자세를 정밀화',
				video: 'kQhd0cr3MuE',
				paper:
					'Gangmin Yu, Chulju Park, and Minseong Choi†. "PLATER: License-Plate-Aided Monocular 3D Vehicle Pose Refinement with 4D Radar Fusion", IEEE Robotics and Automation Letters, 2026.',
				status: 'Under Review',
			},
		],
	},
];

// 지도교수 정보 (Principal Investigator 페이지)
export const PI = {
	name: '최민성',
	nameEn: 'Dr. Minseong Choi',
	title: 'Assistant Professor, Kyonggi University',
	email: 'minseongchoi@kyonggi.ac.kr',
	blog: 'https://blog.naver.com/roboticperception',
	interests: ['Physical AI, Humanoids', 'Autonomous Driving', 'SLAM'],
	experience: [
		{
			period: '03.2026 – Present',
			role: 'Assistant Professor',
			org: 'Department of Electrical Engineering, Kyonggi University',
			detail: 'Physical AI & Humanoid Robots, Autonomous Driving',
		},
		{
			period: '01.2025 – 02.2026',
			role: 'Staff Engineer',
			org: 'AI-Robot Group, Mechatronics Center, Samsung Electronics',
			detail: 'Humanoid Robots, Isaac Sim-Based Digital Twin Simulation, Visual Servoing',
		},
		{
			period: '03.2024 – 12.2024',
			role: 'Post-doctoral Research Fellow',
			org: 'Mechanical Engineering Dept., KAIST (MSC LAB)',
			detail: 'SLAM, Robots, Autonomous Driving, Sensor Fusion, Mechatronics',
		},
	],
	education: [
		{
			period: '09.2019 – 02.2024',
			degree: 'Ph.D., School of Electrical Engineering (Division of Future Vehicle), KAIST',
			detail: 'Research on Vector Map SLAM for Autonomous Driving via Camera and 4D Radar',
		},
		{
			period: '09.2017 – 08.2019',
			degree: 'M.S., School of Electrical Engineering (Division of Future Vehicle), KAIST',
			detail: 'A Study on Self-Energizing Clutch for Hybrid Engine Start using Driving Inertia of the Vehicle',
		},
		{
			period: '03.2013 – 08.2017',
			degree: 'B.S., Mechanical Engineering, Sogang University',
			detail: 'Cum Laude',
		},
	],
	patents: [
		{ id: 'US-17486923', title: 'Method and Apparatus for Removing LiDAR Point Cloud Noise', date: '09.2021' },
		{ id: 'KR-10-2021-0071925', title: 'LiDAR Point Cloud Noise Removal Method and Device', date: '06.2021' },
		{
			id: 'KR-10-2020-0104510',
			title: 'Self-energizing Clutch Transferring Restricted Torque and Hybrid Vehicle',
			date: '10.2020',
		},
	],
	talks: [
		{ date: '2026.09.11', host: '경기대 소프트웨어중심 대학사업단', title: '피지컬 AI의 기술동향' },
		{
			date: '2026.08.19',
			host: '한국로봇산업진흥원(KIRIA)',
			title: 'From Autonomous Driving to Robotics: Vector Map SLAM and Semantic Spatial Intelligence',
		},
		{ date: '2026.03.10', host: '인천대학교', title: '자율주행을 위한 Camera-4D Radar 기반 Vector Map SLAM 연구' },
		{ date: '2024.11.13', host: '경상국립대학교', title: '자율주행을 위한 Visual SLAM 기초' },
		{ date: '2024.02.28', host: '경기대학교', title: 'ROS기반 비전프로그래밍 기초역량 강화' },
	],
	reviewer: [
		'International Conference on Control, Automation, and Systems (ICCAS)',
		'IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)',
	],
};
