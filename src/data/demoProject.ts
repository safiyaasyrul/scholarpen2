import { ProjectData } from '../types';

export const DEMO_PROJECT_DATA: ProjectData = {
  id: 'demo_maritime_ai_co2',
  name: 'DEMO — AI for Maritime CO₂ Emission Prediction and Mitigation',
  createdAt: '2026-03-01T10:00:00.000Z',
  updatedAt: '2026-08-17T21:00:00.000Z',
  isDemo: true,

  // Step 1: Paper Title
  title: 'AI for Maritime CO₂ Emission Prediction and Mitigation: A Systematic Review',
  initialTopic: 'Artificial intelligence and machine learning applications for maritime vessel CO2 emission prediction, operational optimization, and decarbonization strategies',

  // Step 2: Topic Decomposition
  decomposition: {
    fieldOfStudy: 'Maritime Informatics, Sustainable Transportation, and Applied Artificial Intelligence',
    problemStatement: 'Maritime transport accounts for approximately 3% of global anthropogenic greenhouse gas emissions. Complex non-linear interactions between hull hydrodynamics, weather conditions, vessel operational states, and engine performance make accurate CO₂ emission prediction challenging for conventional statistical models.',
    contextSetting: 'International maritime commercial shipping routes, smart ports, emission control areas (ECAs), and global fleet decarbonization regulatory frameworks (IMO Carbon Intensity Indicator & EEXI).',
    populationObject: 'Commercial maritime vessels including container ships, bulk carriers, oil tankers, roll-on/roll-off (Ro-Ro) vessels, and tugboats equipped with Automatic Identification Systems (AIS) and noon-report telemetry.',
    phenomenonOutcome: 'Fuel consumption rate, carbon dioxide (CO₂) emission volume, carbon intensity metrics, energy efficiency gains, and operational carbon reduction through vessel speed and route optimization.',
    technologyMethod: 'Deep learning (LSTM, Bi-LSTM, CNN), ensemble gradient boosting (XGBoost, LightGBM, CatBoost), physics-informed neural networks (PINN), random forests, and multi-objective evolutionary optimization algorithms.',
    geographicScope: 'Global international shipping lanes with specialized regional validations across Northern European ECAs, East Asian coastal shipping corridors, and Trans-Pacific routes.',
    temporalScope: 'Modern operational telemetry and AIS literature spanning 2018 to 2026, aligning with IMO 2030 and 2050 decarbonization milestone targets.',
    keyConcepts: [
      'Maritime Decarbonization',
      'Vessel Fuel Consumption Modeling',
      'Automatic Identification System (AIS)',
      'Physics-Informed Machine Learning',
      'Speed and Route Optimization',
      'IMO Carbon Intensity Indicator (CII)'
    ]
  },

  // Step 3: Taxonomy & Keywords
  taxonomy: [
    {
      id: 'cat_maritime',
      name: 'Maritime Transport & Vessels',
      concepts: [
        {
          id: 'con_vessel',
          name: 'Vessel Types & Operations',
          keywords: [
            { id: 'k1', term: 'ship', type: 'core', selected: true },
            { id: 'k2', term: 'vessel', type: 'core', selected: true },
            { id: 'k3', term: 'maritime transport', type: 'phrase', selected: true },
            { id: 'k4', term: 'container ship', type: 'synonym', selected: true },
            { id: 'k5', term: 'bulk carrier', type: 'synonym', selected: true },
            { id: 'k6', term: 'marine vessel*', type: 'wildcard', selected: true },
            { id: 'k7', term: 'ocean-going vessel', type: 'phrase', selected: true }
          ]
        },
        {
          id: 'con_ais',
          name: 'Navigation & Telemetry',
          keywords: [
            { id: 'k8', term: 'Automatic Identification System', type: 'phrase', selected: true },
            { id: 'k9', term: 'AIS', type: 'abbreviation', selected: true },
            { id: 'k10', term: 'noon report', type: 'phrase', selected: true },
            { id: 'k11', term: 'sensor telemetry', type: 'related', selected: true }
          ]
        }
      ]
    },
    {
      id: 'cat_emissions',
      name: 'Emissions & Decarbonization',
      concepts: [
        {
          id: 'con_co2',
          name: 'Carbon Emissions & Fuel',
          keywords: [
            { id: 'k12', term: 'CO2 emission*', type: 'wildcard', selected: true },
            { id: 'k13', term: 'carbon dioxide', type: 'core', selected: true },
            { id: 'k14', term: 'greenhouse gas', type: 'synonym', selected: true },
            { id: 'k15', term: 'GHG', type: 'abbreviation', selected: true },
            { id: 'k16', term: 'fuel consumption', type: 'phrase', selected: true },
            { id: 'k17', term: 'bunker fuel', type: 'related', selected: true },
            { id: 'k18', term: 'decarboni?ation', type: 'wildcard', selected: true }
          ]
        },
        {
          id: 'con_regulation',
          name: 'Efficiency Indices',
          keywords: [
            { id: 'k19', term: 'Carbon Intensity Indicator', type: 'phrase', selected: true },
            { id: 'k20', term: 'CII', type: 'abbreviation', selected: true },
            { id: 'k21', term: 'EEDI', type: 'abbreviation', selected: true },
            { id: 'k22', term: 'EEXI', type: 'abbreviation', selected: true }
          ]
        }
      ]
    },
    {
      id: 'cat_ai',
      name: 'Artificial Intelligence & Machine Learning',
      concepts: [
        {
          id: 'con_ml',
          name: 'Machine Learning Models',
          keywords: [
            { id: 'k23', term: 'machine learning', type: 'core', selected: true },
            { id: 'k24', term: 'deep learning', type: 'core', selected: true },
            { id: 'k25', term: 'neural network*', type: 'wildcard', selected: true },
            { id: 'k26', term: 'LSTM', type: 'abbreviation', selected: true },
            { id: 'k27', term: 'XGBoost', type: 'core', selected: true },
            { id: 'k28', term: 'random forest', type: 'synonym', selected: true },
            { id: 'k29', term: 'physics-informed neural network', type: 'phrase', selected: true },
            { id: 'k30', term: 'PINN', type: 'abbreviation', selected: true }
          ]
        },
        {
          id: 'con_optimization',
          name: 'Optimization Algorithms',
          keywords: [
            { id: 'k31', term: 'speed optimization', type: 'phrase', selected: true },
            { id: 'k32', term: 'weather routing', type: 'phrase', selected: true },
            { id: 'k33', term: 'genetic algorithm', type: 'synonym', selected: true },
            { id: 'k34', term: 'multi-objective optimization', type: 'phrase', selected: true }
          ]
        }
      ]
    }
  ],

  termCritiques: [
    {
      term: 'bunker fuel',
      issue: 'overly_narrow',
      recommendation: 'Use broader terms like "fuel consumption" or "energy efficiency" to avoid missing studies focused on dual-fuel LNG and methanol vessels.',
      severity: 'suggestion'
    },
    {
      term: 'marine vessel*',
      issue: 'ambiguous',
      recommendation: 'Wildcard * on vessel is effective, but ensure it captures container and bulk carriers specifically when combined with commercial context.',
      severity: 'suggestion'
    }
  ],

  // Step 4: Search Strategy
  searchFilters: {
    publicationTypes: ['Journal Article', 'Review Article', 'Conference Paper'],
    languages: ['English'],
    yearFrom: 2018,
    yearTo: 2026,
    subjectAreas: ['Engineering', 'Computer Science', 'Environmental Science', 'Energy']
  },

  searchStrategy: {
    scopusQuery: 'TITLE-ABS-KEY(("ship" OR "vessel" OR "maritime transport" OR "container ship" OR "bulk carrier") AND ("CO2 emission*" OR "carbon dioxide" OR "fuel consumption" OR "greenhouse gas" OR "GHG" OR "decarboni*ation") AND ("machine learning" OR "deep learning" OR "neural network*" OR "LSTM" OR "XGBoost" OR "physics-informed") AND ("prediction" OR "optimization" OR "AIS" OR "operational efficiency")) AND PUBYEAR > 2017 AND LANGUAGE(english) AND DOCTYPE(ar OR re OR cp)',
    wosQuery: 'TS=(("ship" OR "vessel" OR "maritime transport" OR "container ship") AND ("CO2 emission*" OR "fuel consumption" OR "decarboni$ation") AND ("machine learning" OR "deep learning" OR "neural network*" OR "XGBoost") AND ("prediction" OR "optimization" OR "AIS")) AND PY=(2018-2026) AND LA=(English) AND DT=(Article OR Review OR Proceedings Paper)',
    scholarQuery: '("maritime" OR "ship" OR "vessel") ("CO2 emissions" OR "fuel consumption") ("machine learning" OR "deep learning" OR "neural network") ("AIS" OR "optimization")',
    explanation: {
      selectedTermsRationale: 'Constructed around 4 balanced facets: (1) Maritime Domain & Vessel Context, (2) Carbon & Fuel Consumption Targets, (3) AI/ML Computational Methodologies, and (4) Prediction/Operational Use Cases.',
      synonymGroups: 'Group 1 covers commercial vessel denominations. Group 2 captures emissions, carbon intensity, and fuel consumption metrics. Group 3 covers both data-driven ML and hybrid physics-guided paradigms.',
      booleanStructure: 'Facet intersection using AND operators between 4 core semantic brackets, with internal synonym expansion grouped by OR operators and wildcard stemming.',
      broadVsNarrow: 'Avoided standalone terms like "transport" or "AI" alone to prevent out-of-scope non-maritime road/aviation papers while maintaining broad coverage across shipping segments.',
      recallRisk: 'Minimal recall risk for peer-reviewed literature; slight risk of omitting very recent grey literature technical reports not indexed with standard abstracts.',
      precisionRisk: 'Precision risk is low (<5%) due to mandatory co-occurrence of vessel terms with machine learning and carbon metrics.'
    },
    qualityRating: 'High',
    titleSuggestions: [
      {
        id: 't1',
        title: 'Artificial Intelligence and Machine Learning for Maritime CO₂ Emission Prediction and Decarbonization: A Systematic Review and Evidence Synthesis',
        selected: true
      },
      {
        id: 't2',
        title: 'Data-Driven and Physics-Informed AI in Maritime Decarbonization: Methods, Datasets, and Operational Gaps',
        selected: false
      },
      {
        id: 't3',
        title: 'Machine Learning Approaches for Ship Fuel Consumption and Carbon Emission Estimation: A Comprehensive Systematic Literature Review',
        selected: false
      },
      {
        id: 't4',
        title: 'From AIS Telemetry to Emission Optimization: A State-of-the-Art Review of AI in Maritime Energy Efficiency',
        selected: false
      }
    ]
  },

  // Step 5: Papers
  papers: [
    {
      id: 'paper_001',
      customId: 'SP001',
      title: 'Deep learning approaches for vessel fuel consumption prediction using multi-source AIS and meteorology data',
      normalizedTitle: 'deep learning approaches for vessel fuel consumption prediction using multi source ais and meteorology data',
      authors: ['Wang, H.', 'Zhang, Y.', 'Liu, K.', 'Peng, Z.'],
      year: 2023,
      doi: '10.1016/j.trd.2023.103720',
      normalizedDoi: '10.1016/j.trd.2023.103720',
      abstract: 'Accurate estimation of ship fuel consumption and greenhouse gas emissions is vital for maritime green routing. This study develops a hybrid CNN-LSTM deep learning framework that integrates high-resolution Automatic Identification System (AIS) trajectories with ECMWF weather reanalysis datasets. Evaluated across 12,000 nautical miles of container ship voyage data, the proposed model achieved an R2 of 0.942 and a Mean Absolute Percentage Error (MAPE) of 4.1%, significantly outperforming conventional polynomial regression and standard random forest baselines.',
      journal: 'Transportation Research Part D: Transport and Environment',
      keywords: ['Fuel consumption', 'AIS', 'Deep learning', 'LSTM', 'ECMWF weather', 'Container ship'],
      volume: '119',
      pages: '103720',
      documentType: 'Journal Article',
      sources: ['Scopus', 'Web of Science'],
      isMaster: true
    },
    {
      id: 'paper_002',
      customId: 'SP002',
      title: 'Physics-informed neural networks for ship resistance and greenhouse gas emission estimation under actual sea conditions',
      normalizedTitle: 'physics informed neural networks for ship resistance and greenhouse gas emission estimation under actual sea conditions',
      authors: ['Le, T. M.', 'Chen, J.', 'Sorensen, E.'],
      year: 2024,
      doi: '10.1016/j.oceaneng.2024.117050',
      normalizedDoi: '10.1016/j.oceaneng.2024.117050',
      abstract: 'Purely data-driven machine learning models frequently suffer from physical inconsistency and poor extrapolation outside training domains. We introduce a physics-informed neural network (PINN) architecture embedding the Holtrop-Mennen hydrodynamic resistance equations directly into the loss function. When tested on sea trials of an 8,500 TEU container carrier, the PINN maintained high prediction fidelity (RMSE < 2.3 tons/day CO2) even in severe sea states (Beaufort force 7-9) where empirical baseline errors exceeded 18%.',
      journal: 'Ocean Engineering',
      keywords: ['Physics-informed neural networks', 'PINN', 'Ship resistance', 'CO2 emissions', 'Hydrodynamics'],
      volume: '298',
      pages: '117050',
      documentType: 'Journal Article',
      sources: ['Scopus'],
      isMaster: true
    },
    {
      id: 'paper_003',
      customId: 'SP003',
      title: 'Machine learning for maritime speed optimization and carbon intensity reduction under Carbon Intensity Indicator (CII) regulations',
      normalizedTitle: 'machine learning for maritime speed optimization and carbon intensity reduction under carbon intensity indicator cii regulations',
      authors: ['Du, L.', 'Gao, X.', 'Psaraftis, H. N.'],
      year: 2024,
      doi: '10.1016/j.apenergy.2024.122890',
      normalizedDoi: '10.1016/j.apenergy.2024.122890',
      abstract: 'The IMO Carbon Intensity Indicator (CII) mandates yearly operational carbon intensity ratings for vessels over 5,000 GT. We formulate a dynamic speed optimization framework coupling XGBoost emission predictors with a genetic algorithm. Real-world validation on trans-Pacific bulk carrier operations demonstrates a 12.8% reduction in voyage CO2 emissions while maintaining contracted arrival time windows, enabling older vessels to improve their CII rating from Category D to B.',
      journal: 'Applied Energy',
      keywords: ['Speed optimization', 'Carbon Intensity Indicator', 'CII', 'XGBoost', 'Genetic algorithm', 'Decarbonization'],
      volume: '360',
      pages: '122890',
      documentType: 'Journal Article',
      sources: ['Scopus', 'Web of Science'],
      isMaster: true
    },
    {
      id: 'paper_004',
      customId: 'SP004',
      title: 'A data-driven digital twin framework for ship energy efficiency and emissions monitoring',
      normalizedTitle: 'a data driven digital twin framework for ship energy efficiency and emissions monitoring',
      authors: ['Coraddu, A.', 'Oneto, L.', 'Baldi, F.', 'Cipollini, F.'],
      year: 2021,
      doi: '10.1016/j.oceaneng.2021.109280',
      normalizedDoi: '10.1016/j.oceaneng.2021.109280',
      abstract: 'Digital twins in the shipping industry provide continuous insights into engine degradation and energy consumption. This paper presents an extreme learning machine and support vector regression pipeline leveraging high-frequency onboard sensor streams (1 Hz) collected over three years from a luxury cruise vessel. Results show that onboard sensor drift and biofouling contribute up to 8.4% additional fuel burn, which the ML pipeline accurately quantifies.',
      journal: 'Ocean Engineering',
      keywords: ['Digital twin', 'Energy efficiency', 'Extreme learning machine', 'Biofouling', 'Sensor data'],
      volume: '234',
      pages: '109280',
      documentType: 'Journal Article',
      sources: ['Scopus'],
      isMaster: true
    },
    {
      id: 'paper_005',
      customId: 'SP005',
      title: 'Comparative evaluation of tree-based ensemble algorithms for ship carbon emission estimation from satellite AIS',
      normalizedTitle: 'comparative evaluation of tree based ensemble algorithms for ship carbon emission estimation from satellite ais',
      authors: ['Ahmad, M.', 'Al-Husseini, S.', 'Kristensen, J.'],
      year: 2022,
      doi: '10.1016/j.marpolbul.2022.113940',
      normalizedDoi: '10.1016/j.marpolbul.2022.113940',
      abstract: 'Benchmarking ML algorithms across regional satellite AIS databases is essential for port emission inventories. We compare Random Forest, Extra Trees, XGBoost, LightGBM, and CatBoost on a dataset of 450,000 AIS records covering the Singapore Strait. CatBoost achieved the best balance of training throughput and inference precision (MAE: 0.14 tons CO2/hr), showing superior handling of categorical vessel attributes like engine displacement and hull design.',
      journal: 'Marine Pollution Bulletin',
      keywords: ['CatBoost', 'LightGBM', 'Satellite AIS', 'Port emissions', 'Singapore Strait'],
      volume: '181',
      pages: '113940',
      documentType: 'Journal Article',
      sources: ['Web of Science'],
      isMaster: true
    },
    {
      id: 'paper_006',
      customId: 'SP006',
      title: 'Multi-objective weather routing and speed profiling for container ships using deep reinforcement learning',
      normalizedTitle: 'multi objective weather routing and speed profiling for container ships using deep reinforcement learning',
      authors: ['Zhao, R.', 'Vermeiren, K.', 'Park, S. H.'],
      year: 2025,
      doi: '10.1016/j.trd.2025.104210',
      normalizedDoi: '10.1016/j.trd.2025.104210',
      abstract: 'Dynamic weather routing offers significant carbon abatement potential. We formulate maritime routing as a Markov Decision Process solved via Proximal Policy Optimization (PPO). The agent dynamically adjusts heading and engine power in response to real-time ocean current and wave forecasts. Simulations on the North Atlantic route demonstrated an average 9.6% fuel saving compared to static great-circle navigation, while avoiding sea conditions exceeding safe parametric roll limits.',
      journal: 'Transportation Research Part D: Transport and Environment',
      keywords: ['Weather routing', 'Deep reinforcement learning', 'PPO', 'Fuel saving', 'Wave forecast'],
      volume: '138',
      pages: '104210',
      documentType: 'Journal Article',
      sources: ['Scopus', 'Web of Science'],
      isMaster: true
    },
    {
      id: 'paper_007',
      customId: 'SP007',
      title: 'Automated maritime emission inventory calculation in port waters using AIS trajectories and spatial gradient boosting',
      normalizedTitle: 'automated maritime emission inventory calculation in port waters using ais trajectories and spatial gradient boosting',
      authors: ['Tan, Z.', 'Wong, C. Y.', 'Li, K.'],
      year: 2023,
      doi: '10.1016/j.trb.2023.102715',
      normalizedDoi: '10.1016/j.trb.2023.102715',
      abstract: 'Port area vessel emissions significantly impact coastal air quality and urban public health. We introduce a spatial gradient boosting model trained on terrestrial AIS messages and berthing telemetry to map spatial CO2 and NOx distributions across the Port of Rotterdam. The model successfully detects maneuvering and hotelling emission spikes that traditional bottom-up activity models miss due to temporal aggregation.',
      journal: 'Transportation Research Part B: Methodological',
      keywords: ['Port emissions', 'AIS trajectories', 'Gradient boosting', 'Hotelling emissions', 'Air quality'],
      volume: '172',
      pages: '102715',
      documentType: 'Journal Article',
      sources: ['Scopus'],
      isMaster: true
    },
    {
      id: 'paper_008',
      customId: 'SP008',
      title: 'Explainable artificial intelligence (XAI) for ship fuel consumption modeling: Interpreting feature attributions with SHAP and LIME',
      normalizedTitle: 'explainable artificial intelligence xai for ship fuel consumption modeling interpreting feature attributions with shap and lime',
      authors: ['Lindstad, E.', 'Molina, F.', 'Bocchetti, D.'],
      year: 2023,
      doi: '10.1016/j.enconman.2023.117180',
      normalizedDoi: '10.1016/j.enconman.2023.117180',
      abstract: 'The black-box nature of deep neural networks impedes operational adoption by ship captains and naval architects. This paper applies SHapley Additive exPlanations (SHAP) and LIME to interpret deep neural network and gradient boosting predictions of ship fuel consumption. Analysis reveals that vessel speed through water accounts for 62% of variance, followed by significant wave height (18%) and trim angle (11%), confirming alignment with naval hydrodynamics.',
      journal: 'Energy Conversion and Management',
      keywords: ['Explainable AI', 'SHAP', 'LIME', 'Fuel consumption', 'Ship trim', 'Hydrodynamics'],
      volume: '286',
      pages: '117180',
      documentType: 'Journal Article',
      sources: ['Scopus', 'Web of Science'],
      isMaster: true
    },
    {
      id: 'paper_009',
      customId: 'SP009',
      title: 'Predicting LNG dual-fuel engine emissions and methane slip using hybrid machine learning models',
      normalizedTitle: 'predicting lng dual fuel engine emissions and methane slip using hybrid machine learning models',
      authors: ['Karlis, T.', 'Vassalos, D.', 'Papalexandris, M.'],
      year: 2024,
      doi: '10.1016/j.applthermaleng.2024.123100',
      normalizedDoi: '10.1016/j.applthermaleng.2024.123100',
      abstract: 'Liquefied Natural Gas (LNG) reduces vessel CO2 emissions by up to 25% but introduces the risk of unburned methane slip, a potent greenhouse gas. We evaluate a convolutional neural network combined with support vector regression to predict real-time methane slip and CO2 equivalence across variable engine loads. The model identified critical operational load regimes below 40% MCR where methane slip compromises net greenhouse gas benefits.',
      journal: 'Applied Thermal Engineering',
      keywords: ['LNG dual-fuel', 'Methane slip', 'Greenhouse gas', 'Hybrid ML', 'Alternative fuels'],
      volume: '245',
      pages: '123100',
      documentType: 'Journal Article',
      sources: ['Scopus'],
      isMaster: true
    },
    {
      id: 'paper_010',
      customId: 'SP010',
      title: 'Graph neural networks for maritime trade route emissions tracking and disruption forecasting',
      normalizedTitle: 'graph neural networks for maritime trade route emissions tracking and disruption forecasting',
      authors: ['Zhou, Q.', 'Sun, X.', 'Yang, D.'],
      year: 2025,
      doi: '10.1109/TITS.2025.3421990',
      normalizedDoi: '10.1109/TITS.2025.3421990',
      abstract: 'Global maritime shipping functions as an interconnected spatial-temporal network. We present a Spatio-Temporal Graph Neural Network (ST-GNN) modeling maritime choke points (Suez, Panama, Malacca) and voyage emission propagation during geopolitical disruptions. Empirical testing demonstrates that rerouting around the Cape of Good Hope increases voyage CO2 emissions by 34.2% on average, accurately forecasted 14 days in advance by the ST-GNN.',
      journal: 'IEEE Transactions on Intelligent Transportation Systems',
      keywords: ['Graph neural networks', 'ST-GNN', 'Choke points', 'Rerouting emissions', 'Maritime network'],
      volume: '26',
      pages: '1420-1433',
      documentType: 'Journal Article',
      sources: ['Web of Science', 'Google Scholar'],
      isMaster: true
    },
    {
      id: 'paper_011',
      customId: 'SP011',
      title: 'Uncertainty quantification in machine learning-based ship fuel consumption models using Bayesian neural networks',
      normalizedTitle: 'uncertainty quantification in machine learning based ship fuel consumption models using bayesian neural networks',
      authors: ['Hansen, P. K.', 'Pedersen, E.', 'Olsen, M.'],
      year: 2022,
      doi: '10.1016/j.ress.2022.108640',
      normalizedDoi: '10.1016/j.ress.2022.108640',
      abstract: 'Reliable operational decision-making in maritime navigation requires probabilistic confidence bounds alongside point predictions. We propose a Bayesian Neural Network with Monte Carlo dropout to quantify aleatoric and epistemic uncertainty in ship fuel predictions. Case study findings show that sensor measurement noise in wave spectrum accounts for over 70% of prediction uncertainty in rough waters.',
      journal: 'Reliability Engineering & System Safety',
      keywords: ['Bayesian neural networks', 'Uncertainty quantification', 'Monte Carlo dropout', 'Fuel prediction'],
      volume: '224',
      pages: '108640',
      documentType: 'Journal Article',
      sources: ['Scopus'],
      isMaster: true
    },
    {
      id: 'paper_012',
      customId: 'SP012',
      title: 'Hybrid propulsion power management and fuel reduction in tugboats using deep Q-learning',
      normalizedTitle: 'hybrid propulsion power management and fuel reduction in tugboats using deep q learning',
      authors: ['Castillo, R.', 'Gomez, L.', 'Martini, P.'],
      year: 2023,
      doi: '10.1016/j.enconman.2023.116900',
      normalizedDoi: '10.1016/j.enconman.2023.116900',
      abstract: 'Harbor tugboats exhibit highly dynamic operational profiles characterized by short high-power bollard pull bursts followed by prolonged idling. This paper designs a Deep Q-Network (DQN) energy management strategy for diesel-electric hybrid tugboats with battery energy storage. Hardware-in-the-loop experiments verify a 16.4% fuel reduction and 18.2% CO2 mitigation compared to conventional rule-based heuristic controllers.',
      journal: 'Energy Conversion and Management',
      keywords: ['Hybrid propulsion', 'Deep Q-learning', 'Tugboats', 'Battery energy storage', 'CO2 mitigation'],
      volume: '281',
      pages: '116900',
      documentType: 'Journal Article',
      sources: ['Scopus', 'Web of Science'],
      isMaster: true
    },
    {
      id: 'paper_013',
      customId: 'SP013',
      title: 'Evaluating hull biofouling progression and emission penalties in bulk carriers through unsupervised anomaly detection',
      normalizedTitle: 'evaluating hull biofouling progression and emission penalties in bulk carriers through unsupervised anomaly detection',
      authors: ['Nielsen, B.', 'Andersen, C.', 'Kaufman, L.'],
      year: 2024,
      doi: '10.1016/j.jclepro.2024.141200',
      normalizedDoi: '10.1016/j.jclepro.2024.141200',
      abstract: 'Marine biological growth on hulls significantly increases frictional resistance over prolonged voyage cycles. We deploy an unsupervised autoencoder model to isolate gradual fuel consumption increases attributable to biofouling from short-term weather effects. The framework detected biofouling penalties exceeding 12 tons CO2/day on a Capesize bulk carrier, providing data-driven scheduling for hull cleaning intervals.',
      journal: 'Journal of Cleaner Production',
      keywords: ['Biofouling', 'Autoencoder', 'Hull cleaning', 'Frictional resistance', 'Bulk carrier'],
      volume: '445',
      pages: '141200',
      documentType: 'Journal Article',
      sources: ['Scopus'],
      isMaster: true
    },
    {
      id: 'paper_014',
      customId: 'SP014',
      title: 'Federated learning for collaborative ship emission modeling across confidential shipping carrier fleets',
      normalizedTitle: 'federated learning for collaborative ship emission modeling across confidential shipping carrier fleets',
      authors: ['Zhang, F.', 'Kavussanos, M. G.', 'Tsouknidas, D.'],
      year: 2025,
      doi: '10.1016/j.tre.2025.103590',
      normalizedDoi: '10.1016/j.tre.2025.103590',
      abstract: 'Commercial shipping companies treat operational telemetry and engine fuel logs as highly proprietary trade secrets, preventing centralized model training. We formulate a privacy-preserving Federated Averaging (FedAvg) architecture across 4 global carrier fleets containing 120 vessels. The federated model matched centralized model accuracy within 1.2% while retaining all raw telemetry within enterprise firewalls.',
      journal: 'Transportation Research Part E: Logistics and Transportation Review',
      keywords: ['Federated learning', 'Data privacy', 'Collaborative AI', 'Fleet management', 'Fuel estimation'],
      volume: '194',
      pages: '103590',
      documentType: 'Journal Article',
      sources: ['Scopus', 'Web of Science'],
      isMaster: true
    },

    // Duplicate Papers (Level 1 & Level 3 duplicates to demonstrate deduplication engine)
    {
      id: 'paper_015_dup',
      customId: 'SP015',
      title: 'Deep learning approaches for vessel fuel consumption prediction using multi-source AIS and meteorology data',
      normalizedTitle: 'deep learning approaches for vessel fuel consumption prediction using multi source ais and meteorology data',
      authors: ['Wang, H.', 'Zhang, Y.', 'Liu, K.'],
      year: 2023,
      doi: 'https://doi.org/10.1016/j.trd.2023.103720',
      normalizedDoi: '10.1016/j.trd.2023.103720',
      abstract: 'Accurate estimation of ship fuel consumption and greenhouse gas emissions is vital for maritime green routing. This study develops a hybrid CNN-LSTM deep learning framework that integrates high-resolution Automatic Identification System (AIS) trajectories with ECMWF weather reanalysis datasets.',
      journal: 'Transportation Research Part D',
      keywords: ['Fuel consumption', 'AIS', 'Deep learning'],
      documentType: 'Journal Article',
      sources: ['Web of Science'],
      isDuplicateOf: 'paper_001',
      duplicateScore: 100,
      duplicateBasis: ['Level 1: Exact Normalized DOI Match (10.1016/j.trd.2023.103720)']
    },
    {
      id: 'paper_016_dup',
      customId: 'SP016',
      title: 'Machine learning for maritime speed optimization and carbon intensity reduction under Carbon Intensity Indicator (CII) regulations',
      normalizedTitle: 'machine learning for maritime speed optimization and carbon intensity reduction under carbon intensity indicator cii regulations',
      authors: ['Du, L.', 'Gao, X.', 'Psaraftis, H.'],
      year: 2024,
      doi: '10.1016/j.apenergy.2024.122890',
      normalizedDoi: '10.1016/j.apenergy.2024.122890',
      abstract: 'The IMO Carbon Intensity Indicator (CII) mandates yearly operational carbon intensity ratings for vessels over 5,000 GT. We formulate a dynamic speed optimization framework coupling XGBoost emission predictors with a genetic algorithm.',
      journal: 'Applied Energy',
      keywords: ['Speed optimization', 'CII'],
      documentType: 'Journal Article',
      sources: ['Web of Science'],
      isDuplicateOf: 'paper_003',
      duplicateScore: 100,
      duplicateBasis: ['Level 1: Exact Normalized DOI Match (10.1016/j.apenergy.2024.122890)']
    },
    {
      id: 'paper_017_dup',
      customId: 'SP017',
      title: 'Automated maritime emission inventory calculation in port waters using AIS trajectories and spatial gradient boosting methods',
      normalizedTitle: 'automated maritime emission inventory calculation in port waters using ais trajectories and spatial gradient boosting methods',
      authors: ['Tan, Z.', 'Wong, C.', 'Li, K.'],
      year: 2023,
      doi: '10.1016/j.trb.2023.102715',
      normalizedDoi: '10.1016/j.trb.2023.102715',
      abstract: 'Port area vessel emissions significantly impact coastal air quality. We introduce a spatial gradient boosting model trained on terrestrial AIS messages and berthing telemetry to map spatial CO2 and NOx distributions.',
      journal: 'Transportation Research Part B',
      keywords: ['Port emissions', 'AIS'],
      documentType: 'Conference Paper',
      sources: ['Scopus'],
      isDuplicateOf: 'paper_007',
      duplicateScore: 98.4,
      duplicateBasis: ['Level 1: Exact Normalized DOI Match & High Fuzzy Title Match']
    },
    {
      id: 'paper_018_dup',
      customId: 'SP018',
      title: 'Federated learning for collaborative ship emission modeling across confidential shipping carrier fleets',
      normalizedTitle: 'federated learning for collaborative ship emission modeling across confidential shipping carrier fleets',
      authors: ['Zhang, F.', 'Kavussanos, M.'],
      year: 2025,
      doi: '10.1016/j.tre.2025.103590',
      normalizedDoi: '10.1016/j.tre.2025.103590',
      abstract: 'Commercial shipping companies treat operational telemetry and engine fuel logs as highly proprietary trade secrets, preventing centralized model training. We formulate a privacy-preserving Federated Averaging (FedAvg) architecture across 4 global carrier fleets.',
      journal: 'Transportation Research Part E',
      keywords: ['Federated learning', 'Data privacy'],
      documentType: 'Journal Article',
      sources: ['Google Scholar'],
      isDuplicateOf: 'paper_014',
      duplicateScore: 100,
      duplicateBasis: ['Level 1: Exact Normalized DOI Match (10.1016/j.tre.2025.103590)']
    },

    // Excluded Papers during Screening (to test Step 6 & PRISMA numbers)
    {
      id: 'paper_019_ex',
      customId: 'SP019',
      title: 'Electric vehicle charging scheduling and carbon emission reduction in smart urban power grids',
      normalizedTitle: 'electric vehicle charging scheduling and carbon emission reduction in smart urban power grids',
      authors: ['Kim, S.', 'Park, J.'],
      year: 2022,
      doi: '10.1016/j.apenergy.2022.118900',
      normalizedDoi: '10.1016/j.apenergy.2022.118900',
      abstract: 'Urban electric vehicle charging coordination using reinforcement learning. Optimizes residential power load and grid transformer health while cutting indirect vehicle emissions.',
      journal: 'Applied Energy',
      keywords: ['Electric vehicles', 'Smart grid', 'Reinforcement learning'],
      documentType: 'Journal Article',
      sources: ['Scopus'],
      isMaster: true
    },
    {
      id: 'paper_020_ex',
      customId: 'SP020',
      title: 'Aviation trajectory optimization for contrail avoidance and net greenhouse warming mitigation',
      normalizedTitle: 'aviation trajectory optimization for contrail avoidance and net greenhouse warming mitigation',
      authors: ['Schumann, U.', 'Graf, K.'],
      year: 2021,
      doi: '10.1016/j.atmosenv.2021.118400',
      normalizedDoi: '10.1016/j.atmosenv.2021.118400',
      abstract: 'Aircraft cruise altitude adjustment for condensation trail mitigation. Examines commercial airline flight data across the North Atlantic flight corridor.',
      journal: 'Atmospheric Environment',
      keywords: ['Aviation', 'Contrails', 'Flight routing'],
      documentType: 'Journal Article',
      sources: ['Web of Science'],
      isMaster: true
    },
    {
      id: 'paper_021_ex',
      customId: 'SP021',
      title: 'Life cycle assessment of structural steel recycling in shipyard manufacturing facilities',
      normalizedTitle: 'life cycle assessment of structural steel recycling in shipyard manufacturing facilities',
      authors: ['Demir, E.', 'Balkan, T.'],
      year: 2019,
      doi: '10.1016/j.jclepro.2019.117600',
      normalizedDoi: '10.1016/j.jclepro.2019.117600',
      abstract: 'Life cycle analysis of shipyard scrap metal reuse. Focuses on cradle-to-gate industrial smelting energy rather than operational navigation emissions.',
      journal: 'Journal of Cleaner Production',
      keywords: ['Shipyard', 'Steel recycling', 'LCA'],
      documentType: 'Journal Article',
      sources: ['Scopus'],
      isMaster: true
    },
    {
      id: 'paper_022_ex',
      customId: 'SP022',
      title: 'Underwater acoustic noise mapping from commercial container traffic using hydrophone sensor arrays',
      normalizedTitle: 'underwater acoustic noise mapping from commercial container traffic using hydrophone sensor arrays',
      authors: ['McKenna, M.', 'Wiggins, S.'],
      year: 2023,
      doi: '10.1121/10.0019200',
      normalizedDoi: '10.1121/10.0019200',
      abstract: 'Measurement of vessel cavitation noise and impact on marine mammals in the Santa Barbara Channel using passive acoustic telemetry.',
      journal: 'Journal of the Acoustical Society of America',
      keywords: ['Underwater noise', 'Acoustics', 'Hydrophones', 'Marine mammals'],
      documentType: 'Journal Article',
      sources: ['Scopus'],
      isMaster: true
    },
    {
      id: 'paper_023_ex',
      customId: 'SP023',
      title: 'Legal liability frameworks for autonomous maritime surface vessels in international straits',
      normalizedTitle: 'legal liability frameworks for autonomous maritime surface vessels in international straits',
      authors: ['Veal, R.', 'Tsimplis, M.'],
      year: 2020,
      doi: '10.1080/03088839.2020.1746800',
      normalizedDoi: '10.1080/03088839.2020.1746800',
      abstract: 'Examines UNCLOS and COLREGs legal liabilities for crewless commercial ships in international waters. Purely qualitative jurisprudence analysis with no emission or computational models.',
      journal: 'Maritime Policy & Management',
      keywords: ['MASS', 'UNCLOS', 'Maritime law', 'Autonomous ships'],
      documentType: 'Journal Article',
      sources: ['Web of Science'],
      isMaster: true
    },
    {
      id: 'paper_024_ex',
      customId: 'SP024',
      title: 'Historical fuel consumption analysis of coal-fired steamships in early 20th century transatlantic routes',
      normalizedTitle: 'historical fuel consumption analysis of coal fired steamships in early 20th century transatlantic routes',
      authors: ['Harlaftis, G.', 'Theotokas, I.'],
      year: 2018,
      doi: '10.1080/07075332.2018.1450000',
      normalizedDoi: '10.1080/07075332.2018.1450000',
      abstract: 'Economic and archival review of steamship coal bunker consumption between 1900 and 1930. Outside modern temporal scope with no artificial intelligence or machine learning methodology.',
      journal: 'International Journal of Maritime History',
      keywords: ['Maritime history', 'Steamships', 'Coal fuel'],
      documentType: 'Journal Article',
      sources: ['Scopus'],
      isMaster: true
    }
  ],

  duplicatePairs: [
    {
      id: 'dup_paper_001_paper_015_dup',
      paperA: {
        id: 'paper_001',
        customId: 'SP001',
        title: 'Deep learning approaches for vessel fuel consumption prediction using multi-source AIS and meteorology data',
        normalizedTitle: 'deep learning approaches for vessel fuel consumption prediction using multi source ais and meteorology data',
        authors: ['Wang, H.', 'Zhang, Y.', 'Liu, K.', 'Peng, Z.'],
        year: 2023,
        doi: '10.1016/j.trd.2023.103720',
        normalizedDoi: '10.1016/j.trd.2023.103720',
        abstract: 'Accurate estimation of ship fuel consumption and greenhouse gas emissions is vital for maritime green routing. This study develops a hybrid CNN-LSTM deep learning framework that integrates high-resolution Automatic Identification System (AIS) trajectories with ECMWF weather reanalysis datasets.',
        journal: 'Transportation Research Part D: Transport and Environment',
        keywords: ['Fuel consumption', 'AIS', 'Deep learning'],
        sources: ['Scopus']
      },
      paperB: {
        id: 'paper_015_dup',
        customId: 'SP015',
        title: 'Deep learning approaches for vessel fuel consumption prediction using multi-source AIS and meteorology data',
        normalizedTitle: 'deep learning approaches for vessel fuel consumption prediction using multi source ais and meteorology data',
        authors: ['Wang, H.', 'Zhang, Y.', 'Liu, K.'],
        year: 2023,
        doi: 'https://doi.org/10.1016/j.trd.2023.103720',
        normalizedDoi: '10.1016/j.trd.2023.103720',
        abstract: 'Accurate estimation of ship fuel consumption and greenhouse gas emissions is vital for maritime green routing. This study develops a hybrid CNN-LSTM deep learning framework.',
        journal: 'Transportation Research Part D',
        keywords: ['Fuel consumption', 'AIS'],
        sources: ['Web of Science']
      },
      similarityScore: 100,
      status: 'definite',
      detectionBasis: {
        doiMatch: true,
        titleSimilarity: 100,
        authorSimilarity: 90,
        yearMatch: true,
        abstractSimilarity: 96,
        details: 'Level 1: Exact Normalized DOI Match (10.1016/j.trd.2023.103720)'
      },
      resolution: 'confirmed_duplicate',
      masterPaperId: 'paper_001'
    },
    {
      id: 'dup_paper_003_paper_016_dup',
      paperA: {
        id: 'paper_003',
        customId: 'SP003',
        title: 'Machine learning for maritime speed optimization and carbon intensity reduction under Carbon Intensity Indicator (CII) regulations',
        normalizedTitle: 'machine learning for maritime speed optimization and carbon intensity reduction under carbon intensity indicator cii regulations',
        authors: ['Du, L.', 'Gao, X.', 'Psaraftis, H. N.'],
        year: 2024,
        doi: '10.1016/j.apenergy.2024.122890',
        normalizedDoi: '10.1016/j.apenergy.2024.122890',
        abstract: 'The IMO Carbon Intensity Indicator (CII) mandates yearly operational carbon intensity ratings for vessels over 5,000 GT.',
        journal: 'Applied Energy',
        keywords: ['Speed optimization', 'CII'],
        sources: ['Scopus']
      },
      paperB: {
        id: 'paper_016_dup',
        customId: 'SP016',
        title: 'Machine learning for maritime speed optimization and carbon intensity reduction under Carbon Intensity Indicator (CII) regulations',
        normalizedTitle: 'machine learning for maritime speed optimization and carbon intensity reduction under carbon intensity indicator cii regulations',
        authors: ['Du, L.', 'Gao, X.', 'Psaraftis, H.'],
        year: 2024,
        doi: '10.1016/j.apenergy.2024.122890',
        normalizedDoi: '10.1016/j.apenergy.2024.122890',
        abstract: 'The IMO Carbon Intensity Indicator (CII) mandates yearly operational carbon intensity ratings.',
        journal: 'Applied Energy',
        keywords: ['Speed optimization'],
        sources: ['Web of Science']
      },
      similarityScore: 100,
      status: 'definite',
      detectionBasis: {
        doiMatch: true,
        titleSimilarity: 100,
        authorSimilarity: 92,
        yearMatch: true,
        abstractSimilarity: 94,
        details: 'Level 1: Exact Normalized DOI Match (10.1016/j.apenergy.2024.122890)'
      },
      resolution: 'confirmed_duplicate',
      masterPaperId: 'paper_003'
    },
    {
      id: 'dup_paper_007_paper_017_dup',
      paperA: {
        id: 'paper_007',
        customId: 'SP007',
        title: 'Automated maritime emission inventory calculation in port waters using AIS trajectories and spatial gradient boosting',
        normalizedTitle: 'automated maritime emission inventory calculation in port waters using ais trajectories and spatial gradient boosting',
        authors: ['Tan, Z.', 'Wong, C. Y.', 'Li, K.'],
        year: 2023,
        doi: '10.1016/j.trb.2023.102715',
        normalizedDoi: '10.1016/j.trb.2023.102715',
        abstract: 'Port area vessel emissions significantly impact coastal air quality and urban public health.',
        journal: 'Transportation Research Part B',
        keywords: ['Port emissions'],
        sources: ['Scopus']
      },
      paperB: {
        id: 'paper_017_dup',
        customId: 'SP017',
        title: 'Automated maritime emission inventory calculation in port waters using AIS trajectories and spatial gradient boosting methods',
        normalizedTitle: 'automated maritime emission inventory calculation in port waters using ais trajectories and spatial gradient boosting methods',
        authors: ['Tan, Z.', 'Wong, C.', 'Li, K.'],
        year: 2023,
        doi: '10.1016/j.trb.2023.102715',
        normalizedDoi: '10.1016/j.trb.2023.102715',
        abstract: 'Port area vessel emissions significantly impact coastal air quality.',
        journal: 'Transportation Research Part B',
        keywords: ['Port emissions'],
        sources: ['Scopus']
      },
      similarityScore: 98.4,
      status: 'definite',
      detectionBasis: {
        doiMatch: true,
        titleSimilarity: 96,
        authorSimilarity: 90,
        yearMatch: true,
        abstractSimilarity: 92,
        details: 'Level 1: Exact Normalized DOI Match & High Fuzzy Title Match'
      },
      resolution: 'confirmed_duplicate',
      masterPaperId: 'paper_007'
    },
    {
      id: 'dup_paper_014_paper_018_dup',
      paperA: {
        id: 'paper_014',
        customId: 'SP014',
        title: 'Federated learning for collaborative ship emission modeling across confidential shipping carrier fleets',
        normalizedTitle: 'federated learning for collaborative ship emission modeling across confidential shipping carrier fleets',
        authors: ['Zhang, F.', 'Kavussanos, M. G.', 'Tsouknidas, D.'],
        year: 2025,
        doi: '10.1016/j.tre.2025.103590',
        normalizedDoi: '10.1016/j.tre.2025.103590',
        abstract: 'Commercial shipping companies treat operational telemetry and engine fuel logs as highly proprietary trade secrets.',
        journal: 'Transportation Research Part E',
        keywords: ['Federated learning'],
        sources: ['Scopus']
      },
      paperB: {
        id: 'paper_018_dup',
        customId: 'SP018',
        title: 'Federated learning for collaborative ship emission modeling across confidential shipping carrier fleets',
        normalizedTitle: 'federated learning for collaborative ship emission modeling across confidential shipping carrier fleets',
        authors: ['Zhang, F.', 'Kavussanos, M.'],
        year: 2025,
        doi: '10.1016/j.tre.2025.103590',
        normalizedDoi: '10.1016/j.tre.2025.103590',
        abstract: 'Commercial shipping companies treat operational telemetry and engine fuel logs as highly proprietary trade secrets.',
        journal: 'Transportation Research Part E',
        keywords: ['Federated learning'],
        sources: ['Google Scholar']
      },
      similarityScore: 100,
      status: 'definite',
      detectionBasis: {
        doiMatch: true,
        titleSimilarity: 100,
        authorSimilarity: 90,
        yearMatch: true,
        abstractSimilarity: 98,
        details: 'Level 1: Exact Normalized DOI Match (10.1016/j.tre.2025.103590)'
      },
      resolution: 'confirmed_duplicate',
      masterPaperId: 'paper_014'
    }
  ],

  deduplicationSettings: {
    exactDoi: true,
    exactTitle: true,
    fuzzyTitleThreshold: 0.85,
    metadataComparison: true,
    semanticAbstractThreshold: 0.88
  },

  // Step 6: Screenings
  screenings: {
    paper_001: {
      paperId: 'paper_001',
      aiDecision: 'INCLUDE',
      confidence: 96,
      aiReason: 'Directly addresses vessel fuel consumption and emission modeling using deep learning (CNN-LSTM) and AIS telemetry in commercial maritime shipping.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: 'Explicitly investigates container ship voyages.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Predicts fuel consumption rate and emission volume.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'Implements hybrid CNN-LSTM deep learning architectures.' },
        { criterion: 'Published between 2018-2026', type: 'inclusion', satisfied: true, reasoning: 'Published in 2023.' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:10:00Z'
    },
    paper_002: {
      paperId: 'paper_002',
      aiDecision: 'INCLUDE',
      confidence: 98,
      aiReason: 'Pioneers physics-informed neural networks (PINN) for hydrodynamic ship resistance and GHG estimation under actual sea state telemetry.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: 'Evaluated on sea trials of 8,500 TEU container carrier.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Direct quantification of CO2 emissions.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'Physics-informed neural networks with Holtrop-Mennen loss.' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:12:00Z'
    },
    paper_003: {
      paperId: 'paper_003',
      aiDecision: 'INCLUDE',
      confidence: 95,
      aiReason: 'Couples XGBoost emission predictors with genetic algorithm speed optimization specifically targeting IMO CII compliance.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: 'Validated on trans-Pacific bulk carriers.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Focuses on IMO Carbon Intensity Indicator reduction.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'XGBoost with multi-objective genetic algorithms.' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:15:00Z'
    },
    paper_004: {
      paperId: 'paper_004',
      aiDecision: 'INCLUDE',
      confidence: 91,
      aiReason: 'Examines data-driven digital twin pipelines with ELM and SVR to quantify biofouling fuel penalties on high-frequency ship sensor streams.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: 'Sensor streams from commercial cruise vessel.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Quantifies fuel burn penalty and energy efficiency.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'Extreme learning machines & support vector regression.' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:18:00Z'
    },
    paper_005: {
      paperId: 'paper_005',
      aiDecision: 'INCLUDE',
      confidence: 94,
      aiReason: 'Benchmarks tree-based ensemble algorithms (CatBoost, LightGBM, XGBoost) on large-scale satellite AIS datasets for port carbon emission estimation.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: 'Satellite AIS across Singapore Strait shipping.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Calculates hourly CO2 emissions in tons.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'CatBoost, LightGBM, Random Forests.' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:20:00Z'
    },
    paper_006: {
      paperId: 'paper_006',
      aiDecision: 'INCLUDE',
      confidence: 96,
      aiReason: 'Deploys deep reinforcement learning (PPO) for multi-objective weather routing and dynamic speed profiling to minimize fuel consumption.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: 'North Atlantic container ship route simulations.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Fuel saving and greenhouse gas minimization.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'Proximal Policy Optimization reinforcement learning.' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:22:00Z'
    },
    paper_007: {
      paperId: 'paper_007',
      aiDecision: 'INCLUDE',
      confidence: 93,
      aiReason: 'Applies spatial gradient boosting to AIS trajectories for automated high-resolution port emission inventory calculation.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: 'Port of Rotterdam vessel movements.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Port CO2 and NOx emission mapping.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'Spatial gradient boosting models.' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:24:00Z'
    },
    paper_008: {
      paperId: 'paper_008',
      aiDecision: 'INCLUDE',
      confidence: 92,
      aiReason: 'Introduces explainable AI (SHAP and LIME) to interpret feature importance and hydrodynamic interactions in ship fuel neural networks.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: 'Commercial vessel telemetry.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Fuel consumption prediction interpretability.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'XAI (SHAP, LIME) on neural networks.' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:26:00Z'
    },
    paper_009: {
      paperId: 'paper_009',
      aiDecision: 'INCLUDE',
      confidence: 94,
      aiReason: 'Evaluates hybrid CNN-SVR models to predict LNG dual-fuel engine emissions and unburned methane slip.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: 'LNG dual-fuel marine propulsion.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Predicts CO2 equivalence and methane slip.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'Hybrid CNN and Support Vector Regression.' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:28:00Z'
    },
    paper_010: {
      paperId: 'paper_010',
      aiDecision: 'INCLUDE',
      confidence: 93,
      aiReason: 'Uses Spatio-Temporal Graph Neural Networks to forecast shipping rerouting emission impacts across global maritime choke points.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: 'Global commercial shipping network and choke points.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Quantifies rerouting voyage CO2 surges.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'Spatio-Temporal Graph Neural Networks (ST-GNN).' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:30:00Z'
    },
    paper_011: {
      paperId: 'paper_011',
      aiDecision: 'INCLUDE',
      confidence: 91,
      aiReason: 'Applies Bayesian neural networks to quantify aleatoric and epistemic prediction uncertainty in ship fuel consumption forecasting.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: 'Commercial vessel sea passage data.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Fuel consumption rate modeling.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'Bayesian neural networks & Monte Carlo dropout.' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:32:00Z'
    },
    paper_012: {
      paperId: 'paper_012',
      aiDecision: 'INCLUDE',
      confidence: 95,
      aiReason: 'Develops deep Q-learning energy management controllers for diesel-electric hybrid tugboats with battery storage.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: 'Harbor tugboat commercial operations.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Achieves 18.2% CO2 mitigation.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'Deep Q-Networks (DQN).' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:34:00Z'
    },
    paper_013: {
      paperId: 'paper_013',
      aiDecision: 'INCLUDE',
      confidence: 90,
      aiReason: 'Deploys unsupervised autoencoders on bulk carrier telemetry to isolate biofouling frictional drag penalties from weather effects.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: 'Capesize bulk carrier fleet.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Isolates 12 tons CO2/day frictional penalty.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'Unsupervised deep autoencoders.' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:36:00Z'
    },
    paper_014: {
      paperId: 'paper_014',
      aiDecision: 'INCLUDE',
      confidence: 94,
      aiReason: 'Proposes privacy-preserving federated learning across multiple commercial carrier fleets for collaborative emission modeling.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: true, reasoning: '120 commercial vessels across 4 global shipping fleets.' },
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: true, reasoning: 'Fleet-wide fuel consumption estimation.' },
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: true, reasoning: 'Federated Averaging (FedAvg).' }
      ],
      humanDecision: 'INCLUDE',
      screenedAt: '2026-03-02T14:38:00Z'
    },

    // Excluded papers screenings
    paper_019_ex: {
      paperId: 'paper_019_ex',
      aiDecision: 'EXCLUDE',
      confidence: 99,
      aiReason: 'Focuses on land-based urban electric vehicle grid charging rather than maritime vessel operations.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: false, reasoning: 'Investigates electric road cars and residential power grids.' }
      ],
      humanDecision: 'EXCLUDE',
      exclusionReason: 'Wrong context',
      screenedAt: '2026-03-02T14:40:00Z'
    },
    paper_020_ex: {
      paperId: 'paper_020_ex',
      aiDecision: 'EXCLUDE',
      confidence: 99,
      aiReason: 'Studies commercial aviation contrail warming rather than marine shipping.',
      criteriaEvaluations: [
        { criterion: 'Maritime transport / commercial vessels', type: 'inclusion', satisfied: false, reasoning: 'Aviation and aircraft cruise routing.' }
      ],
      humanDecision: 'EXCLUDE',
      exclusionReason: 'Wrong context',
      screenedAt: '2026-03-02T14:42:00Z'
    },
    paper_021_ex: {
      paperId: 'paper_021_ex',
      aiDecision: 'EXCLUDE',
      confidence: 95,
      aiReason: 'Focuses on static shipyard manufacturing scrap recycling rather than operational vessel emissions.',
      criteriaEvaluations: [
        { criterion: 'CO2 / fuel / greenhouse gas emissions during navigation', type: 'inclusion', satisfied: false, reasoning: 'Cradle-to-gate industrial smelting LCA.' }
      ],
      humanDecision: 'EXCLUDE',
      exclusionReason: 'Wrong topic',
      screenedAt: '2026-03-02T14:44:00Z'
    },
    paper_022_ex: {
      paperId: 'paper_022_ex',
      aiDecision: 'EXCLUDE',
      confidence: 98,
      aiReason: 'Investigates underwater acoustic noise propagation and marine mammal bioacoustics without fuel or emission modeling.',
      criteriaEvaluations: [
        { criterion: 'CO2 / fuel / greenhouse gas emissions', type: 'inclusion', satisfied: false, reasoning: 'Measures hydrophone acoustic decibels.' }
      ],
      humanDecision: 'EXCLUDE',
      exclusionReason: 'Wrong outcome',
      screenedAt: '2026-03-02T14:46:00Z'
    },
    paper_023_ex: {
      paperId: 'paper_023_ex',
      aiDecision: 'EXCLUDE',
      confidence: 97,
      aiReason: 'Qualitative legal treatise analyzing UNCLOS navigation treaties with no empirical or machine learning modeling.',
      criteriaEvaluations: [
        { criterion: 'Artificial intelligence or ML methodology', type: 'inclusion', satisfied: false, reasoning: 'Legal jurisprudence analysis with no computational models.' }
      ],
      humanDecision: 'EXCLUDE',
      exclusionReason: 'Wrong methodology',
      screenedAt: '2026-03-02T14:48:00Z'
    },
    paper_024_ex: {
      paperId: 'paper_024_ex',
      aiDecision: 'EXCLUDE',
      confidence: 98,
      aiReason: 'Historical archival study of early 20th century coal-fired steamships; outside temporal scope (2018-2026) and lacks AI methodology.',
      criteriaEvaluations: [
        { criterion: 'Published between 2018-2026 covering modern telemetry', type: 'inclusion', satisfied: false, reasoning: 'Studies 1900-1930 historical coal records.' }
      ],
      humanDecision: 'EXCLUDE',
      exclusionReason: 'Outside date range',
      screenedAt: '2026-03-02T14:50:00Z'
    }
  },

  screeningTargetSetting: 'Moderate',
  customScreeningTarget: 15,

  // Step 7: Thematic Clusters
  themes: [
    {
      id: 'theme_1',
      name: 'AI-Based Vessel Fuel Consumption & Hydrodynamic Modeling',
      description: 'Studies developing and benchmarking deep learning, physics-informed neural networks (PINNs), and tree ensemble models to predict vessel fuel consumption and CO2 emissions from AIS trajectories, weather reanalysis, and high-frequency sensor telemetry.',
      paperIds: ['paper_001', 'paper_002', 'paper_004', 'paper_005', 'paper_008', 'paper_011'],
      percentage: 42.9,
      publicationYears: '2021–2024',
      mainMethodologies: ['CNN-LSTM', 'Physics-Informed Neural Networks (PINN)', 'Extreme Learning Machine', 'CatBoost', 'SHAP/LIME Explainable AI', 'Bayesian Neural Networks'],
      mainDatasets: ['ECMWF ERA5 weather reanalysis', 'High-frequency onboard sensor streams (1 Hz)', 'Satellite & terrestrial AIS', 'Sea trial hydrodynamics logs'],
      mainOutcomes: ['R2 = 0.942 on voyage fuel prediction', 'Hydrodynamic resistance consistency under Beaufort force 7-9', 'Quantified biofouling degradation penalty (8.4%)'],
      countries: ['China', 'Denmark', 'Italy', 'Norway', 'Singapore', 'United States'],
      majorFindings: 'Integrating domain hydrodynamic physics (Holtrop-Mennen equations) into deep neural loss functions overcomes black-box extrapolation failures in extreme sea states, reducing out-of-distribution error by over 60%.',
      limitations: 'Limited sensor calibration protocols across commercial fleets and high reliance on synthetic reanalysis weather rather than onboard wave radar.',
      researchGaps: ['Lack of standardized open-source maritime telemetry datasets', 'Under-explored domain adaptation across diverse hull geometries']
    },
    {
      id: 'theme_2',
      name: 'Dynamic Speed Optimization, Weather Routing & Regulatory Compliance',
      description: 'Operational research formulating multi-objective optimization algorithms, deep reinforcement learning (RL), and genetic algorithms to minimize voyage carbon intensity under IMO CII regulations while respecting maritime safety boundaries.',
      paperIds: ['paper_003', 'paper_006', 'paper_010'],
      percentage: 21.4,
      publicationYears: '2024–2025',
      mainMethodologies: ['Multi-objective Genetic Algorithms', 'Proximal Policy Optimization (PPO)', 'Spatio-Temporal Graph Neural Networks (ST-GNN)', 'XGBoost emission surrogates'],
      mainDatasets: ['Trans-Pacific and North Atlantic voyage tracks', 'Global choke point AIS networks (Suez, Panama)', 'Ocean current & wave forecasts'],
      mainOutcomes: ['12.8% voyage CO2 reduction with CII rating upgrade from D to B', '9.6% fuel savings via dynamic PPO weather routing', '14-day advance forecasting of geopolitical rerouting emissions (+34.2%)'],
      countries: ['China', 'Greece', 'Belgium', 'South Korea'],
      majorFindings: 'Dynamic weather routing coupled with machine learning speed profiling achieves immediate operational carbon reductions without requiring costly propulsion retrofits.',
      limitations: 'Contractual charter party clauses (e.g. standard speed guarantees) and strict port berth windows frequently restrict real-world speed reductions.',
      researchGaps: ['Integration of legal charter party constraints into reinforcement learning reward functions', 'Dynamic port congestion feedback loops']
    },
    {
      id: 'theme_3',
      name: 'Alternative Fuels, Hybrid Power Management & Port Emissions',
      description: 'Investigations into alternative fuel engine modeling (LNG dual-fuel methane slip), diesel-electric battery hybrid power dispatch in harbor craft, port spatial emissions, and privacy-preserving federated fleet learning.',
      paperIds: ['paper_007', 'paper_009', 'paper_012', 'paper_013', 'paper_014'],
      percentage: 35.7,
      publicationYears: '2023–2025',
      mainMethodologies: ['Deep Q-Networks (DQN)', 'Hybrid CNN-SVR', 'Spatial Gradient Boosting', 'Unsupervised Deep Autoencoders', 'Federated Averaging (FedAvg)'],
      mainDatasets: ['Port of Rotterdam AIS and berthing logs', 'Dual-fuel engine test bench logs', 'Harbor tugboat load profiles', 'Confidential 4-carrier telemetry'],
      mainOutcomes: ['18.2% CO2 mitigation in hybrid tugboats via DQN', 'Mapped unburned methane slip trade-offs in LNG engines', 'Achieved 98.8% centralized accuracy in privacy-preserving federated learning across 120 ships'],
      countries: ['Netherlands', 'United Kingdom', 'Spain', 'China'],
      majorFindings: 'Federated learning successfully circumvents commercial data confidentiality barriers, allowing cross-carrier training of robust emission models without leaking proprietary operational logs.',
      limitations: 'High communication overhead for decentralized federated updates in low-bandwidth satellite maritime environments.',
      researchGaps: ['Communication-efficient federated aggregation for offshore vessels', 'Multi-pollutant optimization (CO2, NOx, CH4, black carbon)']
    }
  ],

  // Research Gaps
  researchGaps: [
    {
      id: 'gap_1',
      category: 'Methodological',
      statement: 'Lack of physics-informed hybrid architectures that combine non-linear naval hydrodynamics with uncertainty quantification under dynamic sea states.',
      supportingPaperIds: ['SP002', 'SP008', 'SP011'],
      evidence: 'While SP002 demonstrates the accuracy of PINNs, standard deep learning models (SP001) ignore hydrodynamic physics and lack calibrated confidence intervals needed for autonomous decision-making (SP011).',
      confidence: 'High',
      futureDirection: 'Develop unified Bayesian Physics-Informed Neural Networks (B-PINNs) that output both deterministic fuel consumption predictions and calibrated epistemic uncertainty bounds.'
    },
    {
      id: 'gap_2',
      category: 'Data',
      statement: 'Scarcity of open-source, synchronized high-frequency onboard telemetry datasets and reliance on coarse satellite AIS interpolations.',
      supportingPaperIds: ['SP004', 'SP005', 'SP014'],
      evidence: 'Commercial confidentiality restricts access to raw 1 Hz sensor streams (SP004), forcing regional studies to rely on satellite AIS with 15-60 minute latency (SP005), leading to spatial emission estimation errors in port waters.',
      confidence: 'High',
      futureDirection: 'Establish open-access benchmark telemetry repositories and privacy-preserving federated data-sharing consortiums for maritime decarbonization research.'
    },
    {
      id: 'gap_3',
      category: 'Validation',
      statement: 'Insufficient full-scale, long-term sea trial validation under degraded hull conditions (biofouling and propeller cavitation).',
      supportingPaperIds: ['SP004', 'SP013'],
      evidence: 'Most emission models assume a pristine hull and clean propeller baseline, underestimating real-world fuel consumption by 8% to 15% as biofouling accumulates over multi-year drydocking cycles (SP013).',
      confidence: 'Medium',
      futureDirection: 'Incorporate continuous biofouling growth curves and autoencoder-based hull degradation indexes into long-term voyage planning models.'
    },
    {
      id: 'gap_4',
      category: 'Integration',
      statement: 'Disconnection between algorithmic weather routing solutions and commercial charter party contractual constraints.',
      supportingPaperIds: ['SP003', 'SP006', 'SP010'],
      evidence: 'Theoretical reinforcement learning models (SP006) optimize speed in isolation but fail to account for "hurry-and-wait" port congestion bottlenecks and strict charter party demurrage penalty clauses.',
      confidence: 'High',
      futureDirection: 'Formulate game-theoretic and contract-aware reinforcement learning environments modeling joint ship-port virtual arrival agreements.'
    }
  ],

  // Step 8: PRISMA Statistics
  prismaCounts: {
    recordsScopus: 14,
    recordsWos: 8,
    recordsScholar: 2,
    recordsOther: 0,
    totalIdentified: 24,
    duplicatesRemoved: 4,
    recordsScreened: 20,
    recordsExcluded: 6,
    reportsAssessed: 14,
    reportsExcluded: 0,
    studiesIncluded: 14
  },

  reviewDraftSections: [
    {
      id: 'sec_1',
      title: '1. Introduction',
      content: `Maritime shipping represents the backbone of global commerce, transporting over 80% of world trade volume while contributing approximately 1,076 million tonnes of greenhouse gases annually (IMO, 2020). In response to climate targets established in the 2023 IMO GHG Strategy—which mandates net-zero greenhouse gas emissions by or around 2050—the maritime sector faces urgent regulatory and operational pressures to curtail carbon intensity.

Traditional empirical and naval architectural methods for estimating fuel consumption and greenhouse gas emissions rely on simplified hydrodynamic equations (e.g., the Admiralty coefficient) or deterministic sea trial curves. However, these models exhibit marked deficiencies when predicting vessel performance under complex, non-linear interactions between variable ocean weather, engine operating modes, hull biofouling, and speed profiles.

In recent years, the convergence of high-frequency onboard Internet of Things (IoT) telemetry and satellite-based Automatic Identification System (AIS) data has catalyzed rapid adoption of Artificial Intelligence (AI) and Machine Learning (ML) techniques. This systematic literature review provides a rigorous evidence synthesis of AI-assisted maritime CO₂ emission prediction, operational optimization, and decarbonization strategies.`
    },
    {
      id: 'sec_2',
      title: '2. Methodology',
      content: `This systematic literature review was conducted in strict accordance with the Preferred Reporting Items for Systematic Reviews and Meta-Analyses (PRISMA 2020) guidelines.

2.1 Review Design
The review protocol was designed to systematically identify, screen, extract, and synthesize peer-reviewed empirical studies utilizing AI/ML for maritime vessel emission prediction and operational decarbonization.

2.2 Research Question
What is the state of the art in artificial intelligence and machine learning applications for maritime CO₂ emission prediction, how do data-driven and physics-informed paradigms compare, and what critical methodological and operational gaps impede practical deployment?

2.3 Database Selection
Comprehensive searches were conducted across Scopus, Web of Science Core Collection, and Google Scholar to capture high-impact literature across transportation engineering, computer science, and environmental modeling.

2.4 Search Strategy
Field-specific Boolean search strings were developed using four coordinated facets: (1) Maritime & vessel denominations, (2) Carbon and fuel consumption metrics, (3) AI/ML methodologies, and (4) Prediction and optimization applications.

2.5 Inclusion and Exclusion Criteria
Studies were included if they: (a) focused on commercial maritime vessels; (b) evaluated CO₂, fuel consumption, or operational carbon intensity; (c) utilized artificial intelligence or machine learning; and (d) were published in English between 2018 and 2026. Studies were excluded if focused on road/aviation transport, non-computational legal qualitative reviews, or industrial shipyard manufacturing.

2.6 Deduplication
A 5-level deduplication engine was deployed, resolving exact normalized DOIs, title fuzzy matching, multi-field metadata comparisons, and abstract semantic similarity.

2.7 Screening
Title and abstract screening was conducted using the AI-assisted screening agent with human researcher verification, categorizing records into Include, Exclude (with formal justifications), and Maybe.

2.8 Evidence Extraction
Structured data was extracted across 17 standardized dimensions including methodology, datasets, variables, sample sizes, models, outcomes, limitations, and research gaps.

2.9 Thematic Analysis
Included studies were synthesized into thematic clusters based on methodological paradigms, target operational domains, and technological frameworks.

2.10 PRISMA Process
All screening progression steps were documented and verified against formal arithmetic consistency checks.`
    },
    {
      id: 'sec_3',
      title: '3. Results',
      content: `3.1 Literature Selection
The database search identified 24 bibliographic records (14 Scopus, 8 Web of Science, 2 Google Scholar). Deduplication resolved 4 duplicate records, yielding 20 unique records for screening. Following title and abstract screening, 6 records were excluded due to out-of-scope context (road/aviation: 2), non-operational topics (shipyard LCA/noise: 2), non-computational methods (legal: 1), and date mismatch (historical: 1), resulting in 14 included studies.

3.2 Publication Trends
Publication output exhibited an accelerating upward trajectory from 2021 through 2025, reflecting heightened industry focus following IMO CII implementation in 2023.

3.3 Thematic Distribution
The 14 included studies were structured into three major thematic clusters:
- Theme 1: AI-Based Vessel Fuel Consumption & Hydrodynamic Modeling (6 studies, 42.9%)
- Theme 2: Dynamic Speed Optimization, Weather Routing & Regulatory Compliance (3 studies, 21.4%)
- Theme 3: Alternative Fuels, Hybrid Power Management & Port Emissions (5 studies, 35.7%)

3.4 Major Research Themes
Data-driven deep learning models (CNN-LSTM) achieved superior accuracy (R² > 0.94) for trajectory-level fuel prediction [SP001]. Physics-informed neural networks (PINNs) demonstrated significant robustness under high Beaufort sea states, reducing out-of-distribution errors by embedding naval hydrodynamics [SP002]. Tree-based gradient boosting (CatBoost/XGBoost) provided high computational throughput and explainability via SHAP values [SP005, SP008]. Dynamic weather routing with reinforcement learning demonstrated 9.6% fuel savings [SP006], while federated learning verified collaborative model training without compromising carrier data privacy [SP014].`
    },
    {
      id: 'sec_4',
      title: '4. Discussion',
      content: `The synthesized literature reveals a clear paradigm shift from purely black-box statistical regressors toward hybrid, physics-informed, and explainable AI architectures in maritime decarbonization.

While deep neural networks achieve high empirical accuracy on historical voyage tracks [SP001], their inability to guarantee physical consistency during severe storms has driven the emergence of Physics-Informed Neural Networks (PINNs) [SP002]. Furthermore, operational transparency is increasingly demanded by shipmasters, with SHAP and LIME analyses verifying that vessel speed through water, wave height, and trim angle dominate power consumption variance in alignment with naval hydrodynamics [SP008].

At the fleet management level, privacy-preserving federated learning represents a major breakthrough, proving that proprietary fuel logs can be harnessed collaboratively without enterprise confidentiality risks [SP014].`
    },
    {
      id: 'sec_5',
      title: '5. Research Gaps',
      content: `The systematic synthesis identified four critical research gap dimensions:
1. Methodological Gap: Absence of unified architectures combining naval hydrodynamics with Bayesian uncertainty quantification for autonomous sea navigation [SP002, SP011].
2. Data Gap: Scarcity of open-source high-frequency synchronized sensor datasets, forcing heavy reliance on coarse satellite AIS interpolation [SP004, SP005].
3. Validation Gap: Lack of long-term empirical validation accounting for cumulative hull biofouling and propeller degradation curves [SP013].
4. Integration Gap: Disconnect between theoretical reinforcement learning weather routing models and commercial charter party speed/demurrage contractual clauses [SP006, SP010].`
    },
    {
      id: 'sec_6',
      title: '6. Future Research Directions',
      content: `Future research should prioritize:
1. Development of Bayesian Physics-Informed Neural Networks (B-PINNs) providing reliable epistemic error bounds for safety-critical maritime autonomous surface ships.
2. Creation of multi-carrier federated data consortia with decentralized aggregation protocols optimized for low-bandwidth maritime satellite links.
3. Formulation of contract-aware reinforcement learning environments integrating charter party terms and virtual arrival port scheduling.
4. Comprehensive multi-pollutant life cycle optimization capturing methane slip in LNG engines and black carbon emissions alongside CO₂.`
    },
    {
      id: 'sec_7',
      title: '7. Conclusion',
      content: `Artificial intelligence has evolved from an academic curiosity into an indispensable computational framework for maritime decarbonization. This systematic literature review demonstrates that machine learning models—particularly physics-informed networks, tree-based ensembles, and deep reinforcement learning—offer unprecedented accuracy for vessel fuel estimation, dynamic speed optimization, and fleet emission monitoring. Addressing existing data-sharing barriers and integrating contractual constraints into optimization models will be paramount to realizing the full potential of AI in achieving IMO net-zero greenhouse gas goals.`
    }
  ],

  // Step 9: Review Paper
  reviewPaper: {
    title: 'Artificial Intelligence and Machine Learning for Maritime CO₂ Emission Prediction and Decarbonization: A Systematic Review and Evidence Synthesis',
    abstract: 'Maritime transport accounts for nearly 3% of global anthropogenic greenhouse gas emissions. In response to stringent International Maritime Organization (IMO) decarbonization mandates, artificial intelligence (AI) and machine learning (ML) have emerged as powerful paradigms for vessel emission modeling and operational energy optimization. This systematic literature review evaluates 14 peer-reviewed studies across Scopus, Web of Science, and Google Scholar in accordance with PRISMA guidelines. We synthesize findings across three core thematic pillars: (1) vessel fuel consumption and hydrodynamic modeling, (2) dynamic speed optimization and weather routing under Carbon Intensity Indicator (CII) regulations, and (3) alternative fuels, hybrid propulsion, and port emissions. Evidence indicates that hybrid CNN-LSTM architectures and physics-informed neural networks (PINNs) achieve high prediction accuracy (R² > 0.94) while preserving physical consistency in severe sea states. Explainable AI (SHAP/LIME) and Bayesian uncertainty quantification provide critical operational interpretability for maritime decision-makers. Furthermore, deep reinforcement learning demonstrates 9.6% to 12.8% operational fuel savings, while federated learning enables collaborative multi-carrier fleet modeling without compromising commercial data confidentiality. Finally, we identify key methodological, data, and validation gaps, proposing a research roadmap toward contract-aware, multi-pollutant maritime decarbonization.',
    keywords: [
      'Maritime Decarbonization',
      'Artificial Intelligence',
      'Machine Learning',
      'Fuel Consumption Prediction',
      'Physics-Informed Neural Networks',
      'Automatic Identification System (AIS)',
      'Weather Routing',
      'PRISMA Systematic Review'
    ],
    sections: [
      {
        id: 'p_sec_1',
        number: '1',
        title: 'Introduction',
        content: `International maritime shipping carries over 80% of global merchandise trade by volume, serving as the foundational circulatory system of global supply chains. However, this vast logistical throughput generates approximately 1,076 million tonnes of greenhouse gas emissions annually, representing nearly 3% of global anthropogenic emissions (IMO, 2020). The 2023 IMO Greenhouse Gas Strategy establishes ambitious revised targets, including a 20–30% emissions reduction by 2030, a 70–80% reduction by 2040 (compared to 2008 levels), and net-zero greenhouse gas emissions by or around 2050.

Concurrently, short-term mandatory operational measures—most notably the Energy Efficiency Existing Ship Index (EEXI) and the operational Carbon Intensity Indicator (CII)—have entered into force, requiring commercial vessel operators to calculate, monitor, and progressively reduce annual operational carbon intensity.

Meeting these decarbonization targets necessitates precise quantification of vessel fuel consumption and greenhouse gas emissions across diverse operational profiles. Traditional naval architecture relies on theoretical hydrodynamic equations, towing tank tests, and empirical baseline formulations (e.g., Holtrop-Mennen methods). Although valuable during ship design phases, these deterministic formulations struggle to capture non-linear, dynamic sea-state perturbations, severe wave impacts, biofouling degradation, and real-time engine operating modes during commercial voyages.

The widespread adoption of onboard Internet of Things (IoT) sensors and satellite Automatic Identification Systems (AIS) has catalyzed a data-driven revolution in maritime informatics. Artificial intelligence (AI), machine learning (ML), and deep learning (DL) architectures are increasingly deployed to model vessel power requirements, predict carbon emissions, and optimize voyage execution. This systematic review provides a rigorous, PRISMA-compliant synthesis of AI-assisted maritime emission modeling, analyzing model architectures, empirical performance, operational applications, and unresolved research gaps.`
      },
      {
        id: 'p_sec_2',
        number: '2',
        title: 'Methodology and Evidence Scope',
        content: `This review was designed and executed following the Preferred Reporting Items for Systematic Reviews and Meta-Analyses (PRISMA 2020) statement.

Database searches were conducted across Scopus, Web of Science Core Collection, and Google Scholar using a four-faceted Boolean query combining vessel terminology, carbon/energy metrics, AI/ML methodologies, and operational applications. A total of 24 bibliographic records were retrieved, normalized, and processed through a 5-level deduplication engine (resolving 4 duplicate records).

The remaining 20 unique records underwent title and abstract screening against predefined eligibility criteria. Studies were included if they presented empirical, data-driven, or hybrid computational AI modeling of commercial ship fuel or greenhouse gas emissions published in English between 2018 and 2026. Six studies were excluded with formal reasons (out-of-scope context, non-computational methods, or shipyard manufacturing). Fourteen peer-reviewed studies met all criteria and were retained for full evidence extraction and synthesis.

Evidence Scope Notice: In accordance with standard systematic screening protocol, initial data extraction and thematic categorization are derived from bibliographic records and published abstracts. In-depth technical, statistical, and hyperparameter claims undergo verification against primary research documentation.`
      },
      {
        id: 'p_sec_3',
        number: '3',
        title: 'Literature Selection and Descriptive Synthesis',
        content: `The 14 included studies exhibit significant geographic and methodological diversity, spanning research institutions across Asia, Europe, and North America.

Methodologically, the reviewed literature reflects an evolution through four distinct computational generations:
1. First-Generation Regressors: Standard support vector regression (SVR), polynomial regression, and multi-layer perceptrons.
2. Second-Generation Tree Ensembles: Random Forests, Extra Trees, XGBoost, LightGBM, and CatBoost algorithms optimizing tabular telemetry.
3. Third-Generation Deep Spatiotemporal Models: Convolutional Neural Networks (CNN), Long Short-Term Memory (LSTM), and Bi-LSTM networks capturing voyage time-series dynamics.
4. Fourth-Generation Hybrid & Physics-Guided Systems: Physics-Informed Neural Networks (PINN), Bayesian Neural Networks (BNN), Spatio-Temporal Graph Neural Networks (ST-GNN), and Federated Learning architectures.`
      },
      {
        id: 'p_sec_4',
        number: '4',
        title: 'Thematic Synthesis of Artificial Intelligence Applications',
        content: `4.1 Vessel Fuel Consumption & Hydrodynamic Modeling
Accurate voyage fuel prediction forms the foundation of maritime operational decarbonization. Across the reviewed literature, hybrid deep learning architectures integrating spatial feature extractors with recurrent sequential memory have demonstrated superior performance. Specifically, hybrid CNN-LSTM models trained on combined satellite AIS trajectories and ECMWF ERA5 weather reanalysis achieved an R² of 0.942 and a Mean Absolute Percentage Error (MAPE) of 4.1% on container vessel voyages [SP001].

However, purely statistical machine learning models frequently exhibit physical inconsistencies when extrapolating beyond training data domains. To overcome this limitation, physics-informed neural networks (PINNs) have emerged, embedding governing hydrodynamic resistance laws (such as the Holtrop-Mennen formulations) directly into the loss function [SP002]. On full-scale sea trials of an 8,500 TEU container ship, PINN architectures maintained high prediction fidelity (RMSE < 2.3 tons/day CO₂) even under severe sea states (Beaufort force 7–9), where conventional purely empirical models suffered error surges exceeding 18% [SP002].

In addition to deep learning, tree-based gradient boosting ensembles (CatBoost, LightGBM, and XGBoost) have demonstrated exceptional utility for regional AIS port emission mapping, balancing rapid training throughput with robust handling of categorical vessel hull parameters [SP005, SP007]. To address the "black-box" nature of complex neural architectures, Explainable AI (XAI) frameworks utilizing SHAP and LIME have confirmed that vessel speed through water accounts for approximately 62% of fuel variance, followed by significant wave height (18%) and trim angle (11%), corroborating established naval architecture principles [SP008]. Bayesian Neural Networks have further contributed probabilistic uncertainty quantification, identifying that wave spectrum noise generates over 70% of prediction variance in rough waters [SP011].

4.2 Dynamic Speed Optimization, Weather Routing & CII Compliance
Beyond passive prediction, AI models serve as core decision engines for active operational carbon abatement. Genetic algorithms coupled with XGBoost emission surrogate models demonstrate that dynamic speed profiling on trans-Pacific bulk voyages yields a 12.8% reduction in voyage CO₂ emissions, directly elevating vessels from IMO CII rating Category D to B without compromising contract voyage windows [SP003].

In oceanic transit, deep reinforcement learning—specifically Proximal Policy Optimization (PPO)—enables multi-objective weather routing that dynamically adjusts heading and engine throttle in response to real-time ocean current and wave forecasts, delivering an average 9.6% fuel reduction across North Atlantic voyages [SP006]. On a global macro scale, Spatio-Temporal Graph Neural Networks (ST-GNN) successfully model maritime choke points and predict global rerouting carbon penalties (e.g., a 34.2% emissions surge when rerouting around the Cape of Good Hope) up to 14 days in advance [SP010].

4.3 Alternative Fuels, Hybrid Propulsion & Port Emissions
Decarbonization literature increasingly focuses on alternative fuels and port-level operational modes. For LNG dual-fuel engines, hybrid CNN-SVR models have pinpointed low engine load regimes (<40% MCR) where unburned methane slip significantly negates nominal CO₂ reductions [SP009]. In harbor operations, Deep Q-Networks (DQN) managing battery storage and diesel generators on hybrid tugboats achieved an 18.2% CO₂ reduction compared to conventional rule-based controllers [SP012].

Furthermore, unsupervised deep autoencoders deployed on long-term telemetry have successfully isolated gradual hull biofouling penalties (exceeding 12 tons CO₂/day) from transient weather effects, enabling data-driven hull cleaning schedules [SP013]. Finally, privacy-preserving Federated Learning (FedAvg) has resolved the longstanding barrier of proprietary corporate data silos, achieving 98.8% of centralized model accuracy across 120 commercial vessels without transferring sensitive operational logs outside enterprise firewalls [SP014].`
      },
      {
        id: 'p_sec_5',
        number: '5',
        title: 'Discussion and Practical Implications',
        content: `The synthesized findings highlight a profound maturation in maritime artificial intelligence. The transition from simplistic single-vessel regressors to physics-informed, explainable, and federated learning paradigms addresses historical industry concerns regarding black-box opacity and data confidentiality.

For vessel operators and shipmasters, the integration of SHAP feature attributions [SP008] and Bayesian uncertainty bounds [SP011] builds crucial operational trust, allowing crew members to understand why specific speed and heading adjustments are recommended.

For fleet managers and charterers, dynamic speed optimization provides a cost-effective mechanism for ensuring compliance with IMO Carbon Intensity Indicator (CII) thresholds [SP003], mitigating the risk of commercial vessel down-rating or premature asset obsolescence.

Nevertheless, practical deployment faces substantial non-technical hurdles. Most existing weather routing algorithms assume frictionless voyage execution, ignoring contractual charter party clauses (such as minimum speed covenants and demurrage penalties) and berth scheduling bottlenecks at congested ports.`
      },
      {
        id: 'p_sec_6',
        number: '6',
        title: 'Critical Research Gaps',
        content: `Synthesis of the evidence matrix reveals four primary research gap categories:

1. Methodological Gaps: Existing architectures largely segregate physics-informed formulations [SP002] from Bayesian uncertainty quantification [SP011]. A unified framework combining hydrodynamics, uncertainty bounds, and explainability remains absent.

2. Data Gaps: The field suffers from a severe deficit of open-access, synchronized high-frequency (1 Hz) engine and weather telemetry datasets [SP004]. Regional studies are disproportionately reliant on interpolated satellite AIS, which introduces spatial positioning latency in complex waterways [SP005].

3. Validation Gaps: High-fidelity validation is rarely maintained over multi-year vessel operating cycles. Most models neglect cumulative hull biofouling progression and propeller cavitation degradation [SP013].

4. Integration Gaps: Current reinforcement learning routing algorithms operate in contractual isolation [SP006, SP010], lacking integration with commercial charter party legal frameworks and port virtual arrival collaboration mechanisms.`
      },
      {
        id: 'p_sec_7',
        number: '7',
        title: 'Future Research Directions',
        content: `To address these limitations, future research should focus on four coordinated avenues:

1. Bayesian Physics-Informed Neural Networks (B-PINNs): Developing integrated architectures that enforce hydrodynamic conservation laws while outputting well-calibrated confidence intervals for autonomous voyage planning.

2. Decentralized Maritime Data Consortia: Leveraging federated learning and secure multi-party computation to establish global collaborative training benchmarks across major shipping alliances.

3. Contract-Aware and Multi-Agent Routing: Formulating game-theoretic reinforcement learning models that incorporate charter party constraints, bunker price fluctuations, and virtual arrival agreements.

4. Multi-Pollutant Life Cycle Optimization: Expanding emission models beyond CO₂ to optimize greenhouse gas equivalence (CO₂e) encompassing methane slip, nitrous oxide (N₂O), and black carbon emissions.`
      },
      {
        id: 'p_sec_8',
        number: '8',
        title: 'Conclusion',
        content: `Artificial intelligence and machine learning represent transformative tools for accelerating maritime decarbonization. This systematic literature review confirms that modern data-driven and physics-informed models deliver superior predictive accuracy and operational fuel savings compared to traditional empirical baselines. By bridging existing data-sharing barriers through federated learning and harmonizing optimization algorithms with commercial shipping contracts, AI can serve as a cornerstone of the global maritime transition toward net-zero greenhouse gas emissions.`
      }
    ],
    references: [
      { paperId: 'paper_001', citationKey: '[SP001]', formattedReference: 'Wang, H., Zhang, Y., Liu, K., & Peng, Z. (2023). Deep learning approaches for vessel fuel consumption prediction using multi-source AIS and meteorology data. Transportation Research Part D: Transport and Environment, 119, 103720.', doi: '10.1016/j.trd.2023.103720' },
      { paperId: 'paper_002', citationKey: '[SP002]', formattedReference: 'Le, T. M., Chen, J., & Sorensen, E. (2024). Physics-informed neural networks for ship resistance and greenhouse gas emission estimation under actual sea conditions. Ocean Engineering, 298, 117050.', doi: '10.1016/j.oceaneng.2024.117050' },
      { paperId: 'paper_003', citationKey: '[SP003]', formattedReference: 'Du, L., Gao, X., & Psaraftis, H. N. (2024). Machine learning for maritime speed optimization and carbon intensity reduction under Carbon Intensity Indicator (CII) regulations. Applied Energy, 360, 122890.', doi: '10.1016/j.apenergy.2024.122890' },
      { paperId: 'paper_004', citationKey: '[SP004]', formattedReference: 'Coraddu, A., Oneto, L., Baldi, F., & Cipollini, F. (2021). A data-driven digital twin framework for ship energy efficiency and emissions monitoring. Ocean Engineering, 234, 109280.', doi: '10.1016/j.oceaneng.2021.109280' },
      { paperId: 'paper_005', citationKey: '[SP005]', formattedReference: 'Ahmad, M., Al-Husseini, S., & Kristensen, J. (2022). Comparative evaluation of tree-based ensemble algorithms for ship carbon emission estimation from satellite AIS. Marine Pollution Bulletin, 181, 113940.', doi: '10.1016/j.marpolbul.2022.113940' },
      { paperId: 'paper_006', citationKey: '[SP006]', formattedReference: 'Zhao, R., Vermeiren, K., & Park, S. H. (2025). Multi-objective weather routing and speed profiling for container ships using deep reinforcement learning. Transportation Research Part D: Transport and Environment, 138, 104210.', doi: '10.1016/j.trd.2025.104210' },
      { paperId: 'paper_007', citationKey: '[SP007]', formattedReference: 'Tan, Z., Wong, C. Y., & Li, K. (2023). Automated maritime emission inventory calculation in port waters using AIS trajectories and spatial gradient boosting. Transportation Research Part B: Methodological, 172, 102715.', doi: '10.1016/j.trb.2023.102715' },
      { paperId: 'paper_008', citationKey: '[SP008]', formattedReference: 'Lindstad, E., Molina, F., & Bocchetti, D. (2023). Explainable artificial intelligence (XAI) for ship fuel consumption modeling: Interpreting feature attributions with SHAP and LIME. Energy Conversion and Management, 286, 117180.', doi: '10.1016/j.enconman.2023.117180' },
      { paperId: 'paper_009', citationKey: '[SP009]', formattedReference: 'Karlis, T., Vassalos, D., & Papalexandris, M. (2024). Predicting LNG dual-fuel engine emissions and methane slip using hybrid machine learning models. Applied Thermal Engineering, 245, 123100.', doi: '10.1016/j.applthermaleng.2024.123100' },
      { paperId: 'paper_010', citationKey: '[SP010]', formattedReference: 'Zhou, Q., Sun, X., & Yang, D. (2025). Graph neural networks for maritime trade route emissions tracking and disruption forecasting. IEEE Transactions on Intelligent Transportation Systems, 26, 1420-1433.', doi: '10.1109/TITS.2025.3421990' },
      { paperId: 'paper_011', citationKey: '[SP011]', formattedReference: 'Hansen, P. K., Pedersen, E., & Olsen, M. (2022). Uncertainty quantification in machine learning-based ship fuel consumption models using Bayesian neural networks. Reliability Engineering & System Safety, 224, 108640.', doi: '10.1016/j.ress.2022.108640' },
      { paperId: 'paper_012', citationKey: '[SP012]', formattedReference: 'Castillo, R., Gomez, L., & Martini, P. (2023). Hybrid propulsion power management and fuel reduction in tugboats using deep Q-learning. Energy Conversion and Management, 281, 116900.', doi: '10.1016/j.enconman.2023.116900' },
      { paperId: 'paper_013', citationKey: '[SP013]', formattedReference: 'Nielsen, B., Andersen, C., & Kaufman, L. (2024). Evaluating hull biofouling progression and emission penalties in bulk carriers through unsupervised anomaly detection. Journal of Cleaner Production, 445, 141200.', doi: '10.1016/j.jclepro.2024.141200' },
      { paperId: 'paper_014', citationKey: '[SP014]', formattedReference: 'Zhang, F., Kavussanos, M. G., & Tsouknidas, D. (2025). Federated learning for collaborative ship emission modeling across confidential shipping carrier fleets. Transportation Research Part E: Logistics and Transportation Review, 194, 103590.', doi: '10.1016/j.tre.2025.103590' }
    ],
    claims: [
      {
        id: 'claim_1',
        claim: 'Hybrid CNN-LSTM deep learning frameworks integrating AIS trajectories and ECMWF weather reanalysis achieve high fuel prediction fidelity (R² > 0.94).',
        supportingPaperIds: ['paper_001'],
        verificationStatus: 'supported',
        verificationNotes: 'Directly verified against experimental results in SP001 on 12,000 nm container ship voyages.',
        citationMarker: '[SP001]'
      },
      {
        id: 'claim_2',
        claim: 'Physics-informed neural networks (PINN) embedding Holtrop-Mennen hydrodynamic resistance reduce extrapolation error in severe sea states (Beaufort 7–9).',
        supportingPaperIds: ['paper_002'],
        verificationStatus: 'supported',
        verificationNotes: 'Directly documented in SP002 sea trials of 8,500 TEU container carrier.',
        citationMarker: '[SP002]'
      },
      {
        id: 'claim_3',
        claim: 'Dynamic speed optimization with XGBoost surrogates and genetic algorithms reduces voyage CO2 emissions by up to 12.8% for IMO CII compliance.',
        supportingPaperIds: ['paper_003'],
        verificationStatus: 'supported',
        verificationNotes: 'Fully substantiated by case study findings in SP003.',
        citationMarker: '[SP003]'
      },
      {
        id: 'claim_4',
        claim: 'CatBoost and LightGBM tree ensembles provide superior training throughput and low error on satellite AIS datasets for port emission inventories.',
        supportingPaperIds: ['paper_005', 'paper_007'],
        verificationStatus: 'supported',
        verificationNotes: 'Verified in SP005 (Singapore Strait) and SP007 (Port of Rotterdam).',
        citationMarker: '[SP005, SP007]'
      },
      {
        id: 'claim_5',
        claim: 'Deep reinforcement learning (PPO) weather routing achieves an average 9.6% fuel reduction on North Atlantic container routes.',
        supportingPaperIds: ['paper_006'],
        verificationStatus: 'supported',
        verificationNotes: 'Substantiated by North Atlantic simulation experiments in SP006.',
        citationMarker: '[SP006]'
      },
      {
        id: 'claim_6',
        claim: 'SHAP explainability indicates vessel speed through water accounts for 62% of fuel consumption variance.',
        supportingPaperIds: ['paper_008'],
        verificationStatus: 'supported',
        verificationNotes: 'Directly reported in SP008 feature attribution analysis.',
        citationMarker: '[SP008]'
      },
      {
        id: 'claim_7',
        claim: 'LNG dual-fuel engines exhibit critical methane slip at low engine operating loads (<40% MCR).',
        supportingPaperIds: ['paper_009'],
        verificationStatus: 'supported',
        verificationNotes: 'Directly reported in SP009 experimental test bench results.',
        citationMarker: '[SP009]'
      },
      {
        id: 'claim_8',
        claim: 'Deep Q-learning energy management in hybrid diesel-electric tugboats mitigates CO2 emissions by 18.2%.',
        supportingPaperIds: ['paper_012'],
        verificationStatus: 'supported',
        verificationNotes: 'Verified in SP012 hardware-in-the-loop experiments.',
        citationMarker: '[SP012]'
      },
      {
        id: 'claim_9',
        claim: 'Federated learning across 4 carrier fleets achieves 98.8% centralized accuracy while preserving confidential operational telemetry.',
        supportingPaperIds: ['paper_014'],
        verificationStatus: 'supported',
        verificationNotes: 'Verified in SP014 across 120 commercial vessels.',
        citationMarker: '[SP014]'
      }
    ]
  },

  // Evidence Matrix Extractions
  evidenceExtractions: {
    paper_001: {
      paperId: 'paper_001',
      country: 'China',
      objective: 'Predict container ship fuel consumption from high-resolution AIS and meteorological reanalysis.',
      problem: 'Non-linear multi-source environmental interactions degrade standard statistical fuel models.',
      context: '12,000 nautical miles of container ship commercial voyages.',
      methodology: 'Hybrid CNN-LSTM Deep Neural Networks',
      dataset: 'Terrestrial/Satellite AIS + ECMWF ERA5 reanalysis',
      sample: '12,000 nautical miles voyage telemetry',
      variables: 'Speed over ground, heading, wave height, wind speed, draft, trim, fuel flow rate',
      model: 'CNN (feature extraction) + LSTM (sequential memory)',
      outcome: 'R² = 0.942, MAPE = 4.1%',
      findings: 'Hybrid CNN-LSTM outperforms standard polynomial and random forest regressors significantly.',
      limitations: 'Evaluated solely on container vessel type; requires high-frequency weather data.',
      researchGap: 'Cross-vessel hull geometry generalization.',
      themeId: 'theme_1',
      lastUpdated: '2026-03-02'
    },
    paper_002: {
      paperId: 'paper_002',
      country: 'Denmark / Norway',
      objective: 'Ensure physical hydrodynamic consistency in ship resistance and GHG estimation under extreme sea states.',
      problem: 'Data-driven models violate physical hydrodynamic laws when extrapolating outside training data.',
      context: 'Full-scale sea trials of 8,500 TEU container carrier.',
      methodology: 'Physics-Informed Neural Networks (PINN)',
      dataset: 'Onboard sea trials + Holtrop-Mennen hydrodynamic loss function',
      sample: '18 months sea trial telemetry',
      variables: 'Speed through water, significant wave height, wave period, ship resistance, engine power',
      model: 'Custom PINN with embedded Holtrop-Mennen equations',
      outcome: 'RMSE < 2.3 tons/day CO2; error under Beaufort 7-9 reduced from 18% to <4%',
      findings: 'Embedding domain physics into neural loss functions prevents severe extrapolation errors in storms.',
      limitations: 'High computational overhead during training; requires accurate vessel hydrostatic tables.',
      researchGap: 'Absence of Bayesian uncertainty quantification in PINN formulations.',
      themeId: 'theme_1',
      lastUpdated: '2026-03-02'
    },
    paper_003: {
      paperId: 'paper_003',
      country: 'China / Greece',
      objective: 'Optimize vessel voyage speed to minimize operational carbon intensity under IMO CII regulations.',
      problem: 'Commercial vessels risk down-rating to Category D/E under annual CII rules.',
      context: 'Trans-Pacific bulk carrier commercial trade routes.',
      methodology: 'XGBoost emission surrogates + Multi-objective Genetic Algorithm',
      dataset: 'Bulk carrier noon reports and satellite AIS',
      sample: '32 trans-Pacific bulk voyages',
      variables: 'Speed profile, voyage duration, CII rating, cargo payload, bunker consumption',
      model: 'XGBoost + NSGA-II Genetic Algorithm',
      outcome: '12.8% voyage CO2 reduction; improved CII rating from D to B',
      findings: 'Dynamic speed optimization achieves immediate CII compliance without engine retrofitting.',
      limitations: 'Assumes flexible port arrival windows; ignored charter party demurrage clauses.',
      researchGap: 'Contractual charter party integration in speed planning.',
      themeId: 'theme_2',
      lastUpdated: '2026-03-02'
    },
    paper_004: {
      paperId: 'paper_004',
      country: 'Italy',
      objective: 'Develop digital twin framework for ship energy efficiency and biofouling detection.',
      problem: 'Sensor drift and marine growth increase fuel burn unnoticed over long periods.',
      context: 'High-frequency (1 Hz) sensor telemetry from commercial luxury cruise ship.',
      methodology: 'Extreme Learning Machines (ELM) & Support Vector Regression (SVR)',
      dataset: '3 years of 1 Hz onboard sensor logs (50+ channels)',
      sample: '94 million sensor readings',
      variables: 'Torque, shaft RPM, speed through water, electrical load, sea water temperature',
      model: 'ELM and SVR digital twin pipeline',
      outcome: 'Quantified 8.4% biofouling fuel penalty; detected sensor anomalies in real-time',
      findings: 'High-frequency telemetry enables precise isolation of biological hull fouling.',
      limitations: 'Extremely large dataset size; difficult to replicate across uninstrumented fleets.',
      researchGap: 'Open access benchmark high-frequency datasets.',
      themeId: 'theme_1',
      lastUpdated: '2026-03-02'
    },
    paper_005: {
      paperId: 'paper_005',
      country: 'Singapore',
      objective: 'Benchmark tree-based ensemble algorithms on satellite AIS for regional maritime emissions.',
      problem: 'Port emission calculations suffer from slow processing on massive satellite AIS tables.',
      context: 'Singapore Strait high-density shipping lane.',
      methodology: 'Comparative Tree Ensembles (CatBoost, LightGBM, XGBoost, Random Forest)',
      dataset: '450,000 satellite AIS records in Singapore Strait',
      sample: '450,000 AIS records across 2,200 unique vessels',
      variables: 'AIS speed, heading, ship type, deadweight, engine displacement, estimated power',
      model: 'CatBoost Regressor',
      outcome: 'MAE: 0.14 tons CO2/hr; 4x faster training than deep neural networks',
      findings: 'CatBoost provides the best trade-off for processing massive regional AIS datasets with categorical metadata.',
      limitations: 'Relies on static engine tables for vessels without detailed engine certificates.',
      researchGap: 'Integration of real-time auxiliary engine load profiles.',
      themeId: 'theme_1',
      lastUpdated: '2026-03-02'
    },
    paper_006: {
      paperId: 'paper_006',
      country: 'Belgium / South Korea',
      objective: 'Multi-objective weather routing and speed profiling using reinforcement learning.',
      problem: 'Static great-circle navigation ignores dynamic ocean currents and wave resistance.',
      context: 'North Atlantic container ship route simulations.',
      methodology: 'Deep Reinforcement Learning (Proximal Policy Optimization - PPO)',
      dataset: 'Copernicus marine wave and current forecasts + container ship digital twin',
      sample: '100 simulated transatlantic voyages under seasonal weather',
      variables: 'Waypoint heading, engine power, significant wave height, ship roll angle, arrival time',
      model: 'Actor-Critic PPO agent with safety barrier constraints',
      outcome: '9.6% average fuel reduction; zero violations of parametric roll safety limits',
      findings: 'RL agents discover non-intuitive detours around adverse current systems that save fuel.',
      limitations: 'High simulation training time; deterministic weather forecast assumption.',
      researchGap: 'Weather forecast ensemble uncertainty handling in RL.',
      themeId: 'theme_2',
      lastUpdated: '2026-03-02'
    },
    paper_007: {
      paperId: 'paper_007',
      country: 'Netherlands / China',
      objective: 'Automate port water emission inventory calculation using terrestrial AIS trajectories.',
      problem: 'Traditional port emission inventories miss transient maneuvering and hotelling spikes.',
      context: 'Port of Rotterdam waterways and berthing terminals.',
      methodology: 'Spatial Gradient Boosting + Bottom-up Energy Modeling',
      dataset: 'Terrestrial AIS + port terminal berthing timestamps',
      sample: '18,000 vessel port calls over 12 months',
      variables: 'Position, speed, acceleration, berthing status, auxiliary engine power, fuel type',
      model: 'Spatial LightGBM regressor',
      outcome: 'High-resolution 100m x 100m spatial grid mapping of CO2 and NOx emissions',
      findings: 'Maneuvering and tug-assist phases contribute disproportionately to port local air emissions.',
      limitations: 'Auxiliary boiler fuel consumption estimated indirectly from vessel class averages.',
      researchGap: 'Direct shore-power cold ironing adoption tracking.',
      themeId: 'theme_3',
      lastUpdated: '2026-03-02'
    },
    paper_008: {
      paperId: 'paper_008',
      country: 'Norway / Italy',
      objective: 'Interpret black-box ship fuel neural networks using Explainable AI (SHAP and LIME).',
      problem: 'Shipmasters distrust uninterpretable AI fuel recommendations.',
      context: 'Commercial fleet operational telemetry.',
      methodology: 'Explainable AI (SHAP & LIME) applied to Deep Neural Networks',
      dataset: '2 years of voyage fuel logs and meteorological data',
      sample: '48,000 operational hours across 6 sister vessels',
      variables: 'Speed through water, wave height, wave direction, wind angle, ship trim, water depth',
      model: 'Deep MLP + Kernel SHAP / Tree SHAP explainer',
      outcome: 'Identified speed through water (62%), waves (18%), and trim (11%) as dominant drivers',
      findings: 'SHAP explanations match theoretical naval hydrodynamics, building master confidence in AI guidance.',
      limitations: 'SHAP computation is resource-intensive for high-dimensional real-time telemetry.',
      researchGap: 'Fast real-time surrogate explainability onboard ships.',
      themeId: 'theme_1',
      lastUpdated: '2026-03-02'
    },
    paper_009: {
      paperId: 'paper_009',
      country: 'United Kingdom / Greece',
      objective: 'Predict LNG dual-fuel engine emissions and unburned methane slip.',
      problem: 'Methane slip at low engine loads undermines net greenhouse gas benefits of LNG.',
      context: 'Marine LNG dual-fuel four-stroke engine laboratory test bench.',
      methodology: 'Hybrid CNN-Support Vector Regression (CNN-SVR)',
      dataset: 'Engine bench telemetry across 150 load variations',
      sample: '150 experimental load steady-state cycles',
      variables: 'Engine load (MCR %), pilot diesel injection timing, gas air ratio, exhaust temp, CH4 emission',
      model: '1D-CNN + SVR hybrid predictor',
      outcome: 'Accurate methane slip curve; identified <40% MCR as high-risk methane slip zone',
      findings: 'Operational strategies must prevent prolonged low-load LNG operation to avoid GHG penalties.',
      limitations: 'Test bench conditions do not fully replicate wave-induced engine transient hunting at sea.',
      researchGap: 'Transient dynamic sea state methane slip modeling.',
      themeId: 'theme_3',
      lastUpdated: '2026-03-02'
    },
    paper_010: {
      paperId: 'paper_010',
      country: 'China / Singapore',
      objective: 'Model global trade route emissions and choke point disruption rerouting penalties.',
      problem: 'Geopolitical choke point closures cause massive unquantified shipping emission surges.',
      context: 'Global commercial shipping network connecting 350 international ports.',
      methodology: 'Spatio-Temporal Graph Neural Networks (ST-GNN)',
      dataset: 'Global satellite AIS network graph (2020-2024)',
      sample: '350 port nodes, 1,200 shipping lane edges, 15,000 vessel tracks',
      variables: 'Port throughput, lane congestion, route distance, vessel speed, voyage CO2',
      model: 'ST-GNN with spatial graph convolutions and temporal GRU cells',
      outcome: 'Forecasted +34.2% CO2 surge for Cape of Good Hope rerouting 14 days in advance',
      findings: 'Graph neural networks capture ripple effects of maritime choke point disruptions accurately.',
      limitations: 'Does not account for bunker fuel restocking capacity at alternate intermediate ports.',
      researchGap: 'Bunker fuel supply chain co-optimization in graph models.',
      themeId: 'theme_2',
      lastUpdated: '2026-03-02'
    },
    paper_011: {
      paperId: 'paper_011',
      country: 'Norway',
      objective: 'Quantify aleatoric and epistemic uncertainty in ship fuel predictions using Bayesian neural networks.',
      problem: 'Deterministic fuel predictions give false confidence during hazardous sea passages.',
      context: 'Commercial container vessel North Sea passages.',
      methodology: 'Bayesian Neural Networks (BNN) with Monte Carlo Dropout',
      dataset: 'Onboard bridge telemetry and wave radar records',
      sample: '14 months North Sea navigation data',
      variables: 'Speed over ground, wave spectrum, wind force, rudder angle, fuel rate',
      model: 'Bayesian MLP with variational inference',
      outcome: 'Calibrated prediction confidence intervals; isolated sensor noise as 70% of error',
      findings: 'Wave spectrum measurement error is the largest contributor to fuel prediction uncertainty.',
      limitations: 'Requires Monte Carlo sampling during inference, increasing computational latency.',
      researchGap: 'Physics-informed Bayesian architectures.',
      themeId: 'theme_1',
      lastUpdated: '2026-03-02'
    },
    paper_012: {
      paperId: 'paper_012',
      country: 'Spain',
      objective: 'Optimize hybrid diesel-electric tugboat power dispatch and fuel consumption using reinforcement learning.',
      problem: 'Harbor tugboats exhibit erratic high-burst power profiles causing poor engine fuel efficiency.',
      context: 'Commercial harbor tugboat operations in Mediterranean port.',
      methodology: 'Deep Q-Networks (DQN)',
      dataset: 'Hardware-in-the-loop hybrid tugboat testbed',
      sample: '200 hours operational duty cycle telemetry',
      variables: 'Bollard pull demand, battery state of charge (SoC), diesel generator power, fuel rate',
      model: 'Deep Q-Network with experience replay',
      outcome: '16.4% fuel reduction, 18.2% CO2 mitigation vs rule-based heuristic controller',
      findings: 'DQN learns optimal battery peak-shaving during high-load ship towing maneuvers.',
      limitations: 'Battery degradation over prolonged fast charging cycles was not incorporated in reward.',
      researchGap: 'Battery life cycle degradation-aware RL controllers.',
      themeId: 'theme_3',
      lastUpdated: '2026-03-02'
    },
    paper_013: {
      paperId: 'paper_013',
      country: 'Denmark',
      objective: 'Isolate hull biofouling progression and fuel penalties using unsupervised deep autoencoders.',
      problem: 'Weather resistance fluctuations mask gradual biological fouling growth on ship hulls.',
      context: 'Capesize bulk carrier fleet over 4-year drydocking cycle.',
      methodology: 'Unsupervised Deep Autoencoders + Residual Anomaly Analysis',
      dataset: '4 years of continuous noon reports and satellite weather',
      sample: '1,400 voyage days across 3 Capesize bulk carriers',
      variables: 'Speed, power, draft, water temperature, wave height, fouling penalty index',
      model: 'Deep autoencoder reconstructor trained on post-drydock baseline',
      outcome: 'Isolated 12 tons CO2/day biofouling penalty; optimized hull cleaning timing',
      findings: 'Autoencoders effectively disentangle short-term weather noise from long-term fouling drag.',
      limitations: 'Relies on noon-report data with 24-hour averaging.',
      researchGap: 'Continuous hull roughness estimation via onboard camera vision models.',
      themeId: 'theme_3',
      lastUpdated: '2026-03-02'
    },
    paper_014: {
      paperId: 'paper_014',
      country: 'United Kingdom / Greece',
      objective: 'Enable collaborative ship emission modeling across competing carrier fleets using privacy-preserving federated learning.',
      problem: 'Shipping carriers refuse to share proprietary fuel logs due to commercial trade secrecy.',
      context: '120 commercial vessels across 4 global container and bulk shipping carriers.',
      methodology: 'Federated Learning (Federated Averaging - FedAvg)',
      dataset: 'Decentralized operational telemetry residing on 4 carrier internal servers',
      sample: '120 ships, 2.5 million operational hours',
      variables: 'Speed through water, engine RPM, draft, wind, fuel mass flow',
      model: 'FedAvg multi-client neural network aggregator',
      outcome: 'Achieved 98.8% accuracy of centralized model without moving raw telemetry',
      findings: 'Federated learning solves the maritime industry data-sharing dilemma for decarbonization modeling.',
      limitations: 'High communication rounds required over offshore satellite channels.',
      researchGap: 'Communication-efficient asynchronous federated aggregation for ships.',
      themeId: 'theme_3',
      lastUpdated: '2026-03-02'
    }
  }
};
