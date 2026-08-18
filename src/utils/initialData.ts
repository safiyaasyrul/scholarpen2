import { ProjectData, LiteraturePaper, EvidenceExtraction } from '../types';
import { DEFAULT_PRISMA_CHECKLIST } from './prismaChecklistData';

export const INITIAL_PAPERS: LiteraturePaper[] = [
  {
    id: 'p-001',
    customId: 'SP001',
    title: 'Deep Learning Architectures for Extreme Precipitation Nowcasting: A Multi-Radar Synthesis',
    authors: ['Chen, Wei', 'Martinez, Elena', 'Kowalski, Piotr', 'Zhang, Lin'],
    year: 2023,
    journal: 'IEEE Transactions on Geoscience and Remote Sensing',
    volume: '61',
    issue: '4',
    pages: '102-118',
    doi: '10.1109/TGRS.2023.3289012',
    abstract: 'Accurate precipitation nowcasting is vital for disaster mitigation under escalating climate volatility. We benchmark spatiotemporal deep learning models including ConvLSTM, TrajGRU, and PredRNN on dual-polarization radar grids across 5 European catchments. Convolutional recurrent architectures achieved a Critical Success Index of 0.68 at 2-hour lead time, outperforming classical optical flow methods by 27%. However, severe spatial blurriness emerged at lead times exceeding 90 minutes.',
    keywords: ['Deep Learning', 'Precipitation Nowcasting', 'Radar Meteorology', 'Climate Adaptation', 'Spatiotemporal AI'],
    sourceDatabase: 'IEEE Xplore',
    citationCount: 42,
    fullTextAvailable: true,
    publicationType: 'Journal Article'
  },
  {
    id: 'p-002',
    customId: 'SP002',
    title: 'Physics-Informed Neural Networks for High-Resolution Coastal Inundation Surges',
    authors: ['Vanderbilt, Sarah', 'Gupta, Rajesh', 'Al-Mansoor, Tariq'],
    year: 2024,
    journal: 'Nature Climate Change (Computational Advances)',
    volume: '14',
    issue: '2',
    pages: '189-204',
    doi: '10.1038/s41558-024-01945-8',
    abstract: 'Coastal communities face unprecedented inundation hazards from sea-level rise and storm surges. Standard hydrodynamic models suffer prohibitive computational latency during emergency evacuation forecasting. Here, we present PINN-Surge, integrating 2D shallow water differential equations directly into deep neural loss functions. PINN-Surge delivers 10m-resolution flood maps across the North Sea coastline in 1.4 seconds with sub-decimeter Root Mean Square Error (RMSE: 0.082m).',
    keywords: ['Physics-Informed Neural Networks', 'Coastal Surges', 'Hydrodynamic Modeling', 'Disaster Resilience', 'Sea-Level Rise'],
    sourceDatabase: 'Web of Science',
    citationCount: 29,
    fullTextAvailable: true,
    publicationType: 'Journal Article'
  },
  {
    id: 'p-003',
    customId: 'SP003',
    title: 'Explainable AI for Wildfire Risk Mapping and Forest Fuel Moisture Estimation',
    authors: ['Johansson, Mikael', 'Dubois, Claire', 'Nielsen, Anders'],
    year: 2023,
    journal: 'Remote Sensing of Environment',
    volume: '295',
    pages: '113689',
    doi: '10.1016/j.rse.2023.113689',
    abstract: 'Wildfire frequency has accelerated globally due to prolonged drought cycles. While black-box ensemble classifiers achieve high statistical accuracy in ignition probability estimation, forestry authorities require actionable transparency. Utilizing Sentinel-2 multispectral imagery and ground meteorological stations, we combined XGBoost with SHAP (SHapley Additive exPlanations) and Integrated Gradients. Live fuel moisture content and canopy height emerged as dominant predictors.',
    keywords: ['Explainable AI', 'SHAP', 'Wildfire Vulnerability', 'Sentinel-2', 'Forestry Management'],
    sourceDatabase: 'Scopus',
    citationCount: 57,
    fullTextAvailable: true,
    publicationType: 'Journal Article'
  },
  {
    id: 'p-004',
    customId: 'SP004',
    title: 'Graph Neural Networks for River Catchment Flood Routing and Hydrological Connectivity',
    authors: ['Tanaka, Hiroshi', 'O\'Connor, Brian', 'Sato, Kenji'],
    year: 2022,
    journal: 'Water Resources Research',
    volume: '58',
    issue: '9',
    doi: '10.1029/2022WR031940',
    abstract: 'Topological river networks are naturally structured as directed acyclic graphs. We formulate Graph WaveNet models encoding dendritic river geometries across the Tone and Rhine river basins. GNN architectures demonstrated superior transferability to ungauged river tributaries compared to spatial CNNs (Nash-Sutcliffe Efficiency = 0.89). Extreme discharge peak timings were predicted with under 35 minutes error.',
    keywords: ['Graph Neural Networks', 'Flood Routing', 'Hydrology', 'Dendritic Networks', 'Catchment Basin'],
    sourceDatabase: 'Scopus',
    citationCount: 68,
    fullTextAvailable: true,
    publicationType: 'Journal Article'
  },
  {
    id: 'p-005',
    customId: 'SP005',
    title: 'Transfer Learning for Agricultural Drought Resilience in Data-Scarce Sub-Saharan Regions',
    authors: ['Osei, Kwame', 'Adebayo, Folake', 'Mthembu, Sipho'],
    year: 2024,
    journal: 'Environmental Research Letters',
    volume: '19',
    issue: '3',
    pages: '034012',
    doi: '10.1088/1748-9326/ad2901',
    abstract: 'Smallholder farming systems across East and Southern Africa lack dense in-situ soil moisture sensor telemetry. We pretrained Vision Transformers on global MODIS and ERA5 reanalysis datasets, fine-tuning them on sparse localized soil probe networks in Kenya and Ghana. The transfer learning pipeline achieved an R² of 0.84 for 30-day standardized precipitation evapotranspiration index forecasting.',
    keywords: ['Transfer Learning', 'Agricultural Drought', 'Sub-Saharan Africa', 'Vision Transformers', 'Food Security'],
    sourceDatabase: 'Google Scholar',
    citationCount: 16,
    fullTextAvailable: true,
    publicationType: 'Journal Article'
  },
  {
    id: 'p-006',
    customId: 'SP006',
    title: 'Multi-Agent Reinforcement Learning for Urban Microclimate Heat Island Mitigation',
    authors: ['Schmidt, Markus', 'Bauer, Lisa', 'Weber, Friedrich'],
    year: 2023,
    journal: 'Building and Environment',
    volume: '242',
    pages: '110592',
    doi: '10.1016/j.buildenv.2023.110592',
    abstract: 'Urban heat islands exacerbate heat-related morbidity during summer extremes. We formulate an autonomous Multi-Agent Deep Deterministic Policy Gradient (MADDPG) framework to optimize dynamic green-roof irrigation and responsive reflective shading across Berlin and Vienna districts. Simulated canopy cooling reached 2.3°C during peak diurnal solar irradiance, reducing chiller power demands by 18.4%.',
    keywords: ['Reinforcement Learning', 'Urban Heat Island', 'Microclimate Adaptation', 'Multi-Agent Systems', 'Energy Efficiency'],
    sourceDatabase: 'Web of Science',
    citationCount: 31,
    fullTextAvailable: true,
    publicationType: 'Journal Article'
  },
  {
    id: 'p-007',
    customId: 'SP007',
    title: 'Benchmarking Foundation Models for Carbon Sequestration and Forest Biomass Estimation',
    authors: ['Laurent, Sophie', 'Morales, Camila', 'Gomez, Andres', 'Silva, Lucas'],
    year: 2024,
    journal: 'Global Change Biology',
    volume: '30',
    issue: '5',
    pages: 'e17240',
    doi: '10.1111/gcb.17240',
    abstract: 'Accurate terrestrial aboveground biomass quantification is indispensable for verified carbon credit markets. We evaluated Geospatial Foundation Models (Clay, Prithvi, SatMAE) paired with GEDI LiDAR waveforms in the Amazon and Congo basins. Zero-shot fine-tuning reduced biomass RMSE from 48.2 Mg/ha to 21.6 Mg/ha compared to standard Random Forest baselines, demonstrating spatial generalizability.',
    keywords: ['Geospatial Foundation Models', 'Biomass Estimation', 'Carbon Sequestration', 'GEDI LiDAR', 'Tropical Forests'],
    sourceDatabase: 'Web of Science',
    citationCount: 38,
    fullTextAvailable: true,
    publicationType: 'Journal Article'
  },
  {
    id: 'p-008',
    customId: 'SP008',
    title: 'Deep Generative Diffusion Models for High-Resolution Climate Downscaling',
    authors: ['Kim, Dong-Hyun', 'Park, Ji-Hoon', 'Lee, Sang-Woo'],
    year: 2023,
    journal: 'Journal of Climate',
    volume: '36',
    issue: '21',
    pages: '7611-7629',
    doi: '10.1175/JCLI-D-23-0182.1',
    abstract: 'Coarse resolution (100km) General Circulation Models fail to resolve complex orographic precipitation gradients needed by local civil infrastructure planners. We deploy score-based conditional diffusion models (SR-DiffClimate) to super-resolve CMIP6 projections to 2km topography over mountainous terrain. The diffusion formulation preserves non-Gaussian precipitation tails without the mode-collapse observed in GANs.',
    keywords: ['Diffusion Models', 'Climate Downscaling', 'CMIP6', 'Orographic Precipitation', 'Generative AI'],
    sourceDatabase: 'Scopus',
    citationCount: 44,
    fullTextAvailable: true,
    publicationType: 'Journal Article'
  },
  {
    id: 'p-009',
    customId: 'SP009',
    title: 'Active Learning for Rapid Post-Disaster Damage Assessment via Aerial Imagery',
    authors: ['Haddad, Rania', 'Khoury, Ziad', 'Mansour, Fadi'],
    year: 2022,
    journal: 'International Journal of Disaster Risk Reduction',
    volume: '80',
    pages: '103218',
    doi: '10.1016/j.ijdrr.2022.103218',
    abstract: 'Disaster response teams require rapid categorization of structural collapse following severe cyclonic hurricanes. By coupling Bayesian uncertainty sampling with human-in-the-loop Active Learning, our convolutional pipeline prioritized ambiguous post-event UAV drone swarms. Labeling effort was reduced by 64% while maintaining 92.4% F1-score across 12,000 damaged structures in the Caribbean basin.',
    keywords: ['Active Learning', 'Disaster Assessment', 'Hurricane Resilience', 'UAV Imagery', 'Human-in-the-Loop'],
    sourceDatabase: 'Scopus',
    citationCount: 51,
    fullTextAvailable: true,
    publicationType: 'Journal Article'
  },
  {
    id: 'p-010',
    customId: 'SP010',
    title: 'Physics-Guided Recurrent Networks for Glacial Lake Outburst Flood (GLOF) Early Warning',
    authors: ['Bhattarai, Ramesh', 'Sharma, Pradeep', 'Karki, Sunita'],
    year: 2024,
    journal: 'Journal of Hydrology: Regional Studies',
    volume: '52',
    pages: '101684',
    doi: '10.1016/j.ejrh.2024.101684',
    abstract: 'Himalayan deglaciation is rapidly expanding unstable proglacial moraine lakes, heightening catastrophic outburst risks for downstream valleys. We construct a Physics-Guided LSTM incorporating thermokarst expansion equations and hydrostatic dam stress constraints across 18 glacial lakes in the Nepal Himalayas. The physics penalty reduced false alarm rates by 41% compared to standard empirical thresholds.',
    keywords: ['Glacial Lake Outburst Floods', 'Physics-Guided Machine Learning', 'Himalayas', 'Early Warning Systems', 'Cryosphere'],
    sourceDatabase: 'Google Scholar',
    citationCount: 22,
    fullTextAvailable: true,
    publicationType: 'Journal Article'
  }
];

export const INITIAL_EXTRACTIONS: Record<string, EvidenceExtraction> = {
  'p-001': {
    paperId: 'p-001',
    country: 'Europe (5 catchments: Germany, UK, France, Poland, Italy)',
    objective: 'Benchmark spatiotemporal deep learning architectures against optical flow for extreme convective precipitation nowcasting.',
    problem: 'Radar beam occlusion and rapid cloud morphogenesis lead to catastrophic lead-time decay in classical kinematic extrapolation.',
    context: 'Operational meteorology radar networks under convective summer thunderstorm regimes.',
    methodology: 'Spatiotemporal Deep Learning (ConvLSTM, TrajGRU, PredRNN v2) benchmarked with CSI and FAR metrics.',
    dataset: 'Dual-polarization composite radar reflectivity grids (5-min temporal, 1km spatial resolution, 2018-2022).',
    sample: '128,000 radar sequence snapshots across 5 European meteorological agencies.',
    variables: 'Radar reflectivity (dBZ), differential reflectivity (ZDR), Doppler velocity, 0-120 min lead time.',
    model: 'ConvLSTM + TrajGRU + PredRNN v2 with Spatiotemporal Memory Flow.',
    outcome: 'Critical Success Index (CSI) = 0.68 at 2-hr lead time (+27% vs classical optical flow baselines).',
    findings: 'Recurrent convolutional cells maintain intense precipitation core tracking up to 90 min; however, severe spatial attenuation and blurriness occur beyond 100 min.',
    limitations: 'High computational inference cost; significant spatial smoothing of high-frequency peak rain rates; requires full-text ablation verification.',
    researchGap: 'Lack of multi-sensor fusion incorporating satellite geostationary lightning mappers and in-situ rain gauges into recurrent loss formulations.',
    statisticalMetrics: 'CSI=0.68, FAR=0.21, HSS=0.64 at lead time 120min',
    fullTextVerified: false
  },
  'p-002': {
    paperId: 'p-002',
    country: 'North Sea Coastline (Netherlands, UK, Germany)',
    objective: 'Develop sub-second 2D physics-informed neural surrogate model for coastal storm surge inundation.',
    problem: 'Numerical solving of 2D shallow water differential equations requires minutes to hours, preventing real-time emergency evacuation routing.',
    context: 'Extreme winter extratropical cyclones and spring astronomical high tides.',
    methodology: 'Physics-Informed Neural Networks (PINNs) with Navier-Stokes shallow water continuity and momentum loss constraints.',
    dataset: 'NOAA & Copernicus coastal bathymetry, tidal gauge telemetry, ECMWF wind stress fields (1990-2023).',
    sample: '3,400 storm surge synthetic scenarios validated against 42 historical surge events.',
    variables: 'Sea surface elevation (eta), depth-averaged velocities (u, v), bottom friction coefficients, wind shear.',
    model: 'PINN-Surge (Multi-scale Fourier Feature MLP with embedded PDE residual loss).',
    outcome: 'Inference runtime = 1.4s (380x speedup); RMSE = 0.082m relative to high-fidelity Delft3D-FM simulations.',
    findings: 'Enforcing physical conservation laws in neural loss functions prevents unphysical water mass creation at dry-wet shoreline boundaries.',
    limitations: 'Validation constrained to macro-tidal North Sea coastal geomorphology; requires adaptation for coral reef wave-breaking dissipation.',
    researchGap: 'Absence of stochastic wave-current coupling and dynamic seawall breach mechanisms in current physics-informed surrogates.',
    statisticalMetrics: 'RMSE=0.082m, Inference=1.4s, NSE=0.96',
    fullTextVerified: false
  },
  'p-003': {
    paperId: 'p-003',
    country: 'Mediterranean Basin (Spain, France, Greece)',
    objective: 'Formulate transparent, explainable machine learning models for regional wildfire susceptibility mapping.',
    problem: 'Forestry agencies distrust opaque deep learning predictions during operational firefighting deployment.',
    context: 'Mediterranean scrubland and pine forests under extreme summer heatwaves (40°C+).',
    methodology: 'Gradient Boosted Decision Trees (XGBoost) interpreted via SHAP TreeExplainer and Integrated Gradients.',
    dataset: 'Sentinel-2 Level-2A surface reflectance, ERA5-Land reanalysis, historical EFFIS fire ignition perimeters (2015-2023).',
    sample: '8,920 confirmed wildfire ignition centroids paired with 26,000 non-fire background points.',
    variables: 'NDVI, Normalized Burn Ratio (NBR), live fuel moisture, vapor pressure deficit (VPD), slope, aspect, road proximity.',
    model: 'XGBoost with Bayesian Hyperparameter Optimization + SHAP Global/Local Importance.',
    outcome: 'ROC-AUC = 0.942; Identified live fuel moisture content (<65%) and VPD (>3.2 kPa) as 62% of predictive contribution.',
    findings: 'Explainable AI unlocks local feature attribution for incident commanders, resolving conflicts between terrain slope and wind vector dominance.',
    limitations: 'Fuel moisture calculations rely on cloud-free optical Sentinel-2 acquisitions, causing latency during persistent overcast weather.',
    researchGap: 'Integration of synthetic aperture radar (Sentinel-1 SAR) to penetrate cloud cover for real-time all-weather fuel moisture estimation.',
    statisticalMetrics: 'ROC-AUC=0.942, F1=0.88, PR-AUC=0.91',
    fullTextVerified: false
  },
  'p-004': {
    paperId: 'p-004',
    country: 'Japan (Tone River) & Central Europe (Rhine River)',
    objective: 'Model non-linear streamflow routing and flash flood propagation using dendritic Graph Neural Networks.',
    problem: 'Standard spatial CNNs fail to capture non-Euclidean stream channel bifurcations and upstream-downstream hydro-topological connectivity.',
    context: 'Montane river basins subject to typhoons and rapid snowmelt flash discharge.',
    methodology: 'Spatio-Temporal Graph Neural Networks (Graph WaveNet with adaptive adjacency matrix learning).',
    dataset: 'USGS, MLIT Japan, and GRDC hydrological gauge streamflow series (1980-2022) with 30m HydroSHEDS DEM.',
    sample: '482 gauging stations across 3 major river basins covering 120,000 km².',
    variables: 'River discharge (m³/s), gauge stage height, upstream accumulated precipitation, catchment soil saturation.',
    model: 'Graph WaveNet (Spatial Graph Convolution + Temporal Dilated 1D Causal Inceptions).',
    outcome: 'Nash-Sutcliffe Efficiency (NSE) = 0.89; Peak discharge arrival timing error < 35 min across 12-hour horizons.',
    findings: 'Topological GNNs retain zero-shot generalizability to ungauged tributary reaches when pre-trained on river graph invariants.',
    limitations: 'Performance drops during dam spillway regulation events not explicitly encoded in graph node attributes.',
    researchGap: 'Coupling dynamic human hydraulic infrastructure (locks, reservoirs, hydropower bypasses) into graph edge transmission matrices.',
    statisticalMetrics: 'NSE=0.89, KGE=0.86, Peak Error < 35min',
    fullTextVerified: false
  },
  'p-005': {
    paperId: 'p-005',
    country: 'Sub-Saharan Africa (Kenya, Ghana, Ethiopia)',
    objective: 'Evaluate transfer learning from satellite foundation models for agricultural drought monitoring in data-sparse smallholder farms.',
    problem: 'Sparse in-situ agricultural telemetry prevents training deep learning models from scratch in developing global South regions.',
    context: 'Rainfed subsistence agriculture vulnerable to El Niño southern oscillation drought anomalies.',
    methodology: 'Transfer Learning with fine-tuned Vision Transformers (ViT-B/16) pre-trained on global MODIS/ERA5 records.',
    dataset: 'CHIRPS precipitation, MODIS Terra/Aqua vegetation indices, sparse TAHMO automated weather stations.',
    sample: '24 in-situ soil moisture stations and 15,000 km² cropland Sentinel tiles.',
    variables: 'Standardized Precipitation Evapotranspiration Index (SPEI-30), NDVI anomaly, thermal anomaly, soil depth moisture (0-50cm).',
    model: 'Pre-trained ViT-B/16 with multi-headed spatial cross-attention heads.',
    outcome: 'Coefficient of Determination (R²) = 0.84 for 30-day forward SPEI prediction with only 5 years of local training calibration.',
    findings: 'Global spatial self-attention priors transfer across equatorial biomes, requiring 75% fewer local ground calibration stations.',
    limitations: 'Smallholder intercropping field boundaries (<0.5 ha) challenge 250m coarse MODIS thermal resolution.',
    researchGap: 'Multi-resolution cross-sensor downscaling combining PlanetScope 3m constellations with Sentinel-2 for micro-plot agricultural resilience.',
    statisticalMetrics: 'R²=0.84, MAE=0.18, RMSE=0.24',
    fullTextVerified: false
  },
  'p-006': {
    paperId: 'p-006',
    country: 'Germany (Berlin) & Austria (Vienna)',
    objective: 'Simulate urban microclimate cooling via multi-agent reinforcement learning control of adaptive building envelopes.',
    problem: 'Fixed static green roofs fail to adjust to compound extreme heatwaves and water scarcity constraints.',
    context: 'Dense European urban cores experiencing amplified urban heat island (UHI) night-time thermal retention.',
    methodology: 'Multi-Agent Deep Deterministic Policy Gradient (MADDPG) coupled with ENVI-met 3D microclimate micro-physics solver.',
    dataset: 'City of Berlin 3D LoD2 building models, urban eddy covariance flux towers, localized smart thermometer nodes.',
    sample: '2.5 km² high-density residential urban canyon grids.',
    variables: 'Air temperature (°C), mean radiant temperature (Tmrt), green-roof substrate moisture, kinetic shutter angles, building cooling load.',
    model: 'MADDPG with decentralized actor-critic network and shared cooperative environmental reward.',
    outcome: 'Canopy layer cooling of 2.3°C at peak solar noon; 18.4% reduction in district cooling electrical demand.',
    findings: 'Coordinated neighborhood-scale shading and timed nocturnal evaporative pulse irrigation drastically outperforms decoupled single-building control.',
    limitations: 'High computational burden of coupling high-dimensional RL agents to CFD ENVI-met iterations.',
    researchGap: 'Surrogate meta-model acceleration for city-scale real-time reinforcement learning dispatch across millions of urban buildings.',
    statisticalMetrics: 'Cooling Delta=-2.3°C, Power Saved=18.4%, P-value < 0.001',
    fullTextVerified: false
  },
  'p-007': {
    paperId: 'p-007',
    country: 'South America (Amazon Basin) & Central Africa (Congo Basin)',
    objective: 'Benchmark self-supervised geospatial foundation models for pantropical forest aboveground biomass (AGB) and carbon inventory.',
    problem: 'Empirical forest inventory plots cover <0.01% of tropical rainforests; traditional regression overfits cloud-polluted optical reflectance.',
    context: 'Intact and degraded tropical rainforests undergoing deforestation pressures.',
    methodology: 'Geospatial Foundation Model Fine-tuning (Clay & Prithvi) paired with NASA GEDI spaceborne LiDAR waveforms.',
    dataset: 'GEDI Level 4A footprints (25m), Sentinel-1 C-band SAR backscatter, Sentinel-2 surface reflectance (2019-2023).',
    sample: '450,000 GEDI forest canopy shots across Brazilian Amazon and Congolese forests.',
    variables: 'Canopy relative height metrics (RH50, RH98), SAR polarimetric ratios (VH/VV), optical spectral indices, aboveground biomass density (Mg/ha).',
    model: 'Prithvi-100M & Clay Foundation Models with spatial token masking and linear probe heads.',
    outcome: 'AGB estimation RMSE reduced from 48.2 Mg/ha (Random Forest baseline) to 21.6 Mg/ha (Foundation Model probe).',
    findings: 'Self-supervised masked autoencoder pre-training learns rich phenological and textural representations robust to atmospheric haze and moisture.',
    limitations: 'GEDI orbital coverage gaps between 51.6°N and 51.6°S; LiDAR signal attenuation in dense multi-layered canopy crowns >45m.',
    researchGap: 'Fusion of spaceborne P-band radar (BIOMASS mission) with foundation vision transformers for deep below-canopy woody volume estimation.',
    statisticalMetrics: 'RMSE=21.6 Mg/ha, R²=0.91, Bias=-1.4 Mg/ha',
    fullTextVerified: false
  },
  'p-008': {
    paperId: 'p-008',
    country: 'Global & Alpine Regions (European Alps, Rocky Mountains)',
    objective: 'Generate kilometer-scale daily precipitation downscaling projections using conditional diffusion generative models.',
    problem: 'Generative Adversarial Networks (GANs) suffer mode collapse, distorting extreme precipitation recurrence intervals in climate projections.',
    context: 'High-mountain topography where global climate models miss localized orographic rain shadow and snowpack dynamics.',
    methodology: 'Score-based Denoising Diffusion Probabilistic Models (DDPM) conditioned on CMIP6 100km thermodynamic atmospheric states.',
    dataset: 'ERA5 reanalysis, CMIP6 multi-model ensemble (CESM2, MPI-ESM1-2-HR), high-resolution Alpine gauge gridded datasets (APGD).',
    sample: '40 years of continuous daily precipitation grids (1980-2020) at 2km spatial resolution.',
    variables: 'Daily precipitation total (mm/day), geopotential height (500 hPa), specific humidity (850 hPa), surface elevation gradient.',
    model: 'SR-DiffClimate (U-Net backbone with cross-attention conditioning and cosine noise scheduling).',
    outcome: 'Preserved 99.9th percentile extreme precipitation tails with 89% lower Wasserstein distance compared to Super-Resolution GANs.',
    findings: 'Diffusion models synthesize realistic stochastic convective cell structures without the artificial blurriness of L1/L2 regression losses.',
    limitations: 'Sampling diffusion generation requires 50-100 denoising iterations per climate scenario timestep.',
    researchGap: 'Consistency distillation and flow matching techniques to accelerate climate downscaling inference by 50x for century-long multi-member ensembles.',
    statisticalMetrics: 'Wasserstein Distance=0.042, Tail Error < 6%, Peak Fidelity=0.94',
    fullTextVerified: false
  },
  'p-009': {
    paperId: 'p-009',
    country: 'Caribbean Basin (Puerto Rico, Bahamas, Dominica)',
    objective: 'Accelerate post-hurricane structural damage mapping through human-in-the-loop active learning on UAV drone imagery.',
    problem: 'Manual inspection of hundreds of thousands of aerial building photos takes weeks, delaying emergency life-saving federal disaster relief.',
    context: 'Island environments struck by Category 4 and 5 hurricanes (e.g., Hurricane Maria, Hurricane Dorian).',
    methodology: 'Bayesian Active Learning by Disagreement (BALD) paired with EfficientNet-B5 convolutional classification.',
    dataset: 'NOAA National Geodetic Survey post-disaster orthomosaic imagery, high-resolution commercial UAV drone collections.',
    sample: '12,000 labeled damaged buildings categorized into 4 damage tiers (No Damage, Minor, Major, Destroyed).',
    variables: 'Roof structural integrity, debris scatter radius, wall breach status, optical RGB texture, building footprint polygon.',
    model: 'EfficientNet-B5 + Monte Carlo Dropout for epistemic uncertainty estimation.',
    outcome: 'Achieved 92.4% macro F1-score while requiring only 36% of human labeling budget (64% reduction in manual effort).',
    findings: 'Active learning selectively routes ambiguous occluded roof structures to human disaster experts while auto-certifying clear-cut damage instances.',
    limitations: 'Pre-disaster building baseline vector geometry is required for optimal differential structural shift evaluation.',
    researchGap: 'Zero-shot foundation segmentation models (e.g. SAM / Grounding DINO) adapted for fine-grained disaster debris topology without manual training.',
    statisticalMetrics: 'Macro F1=0.924, Labeling Reduction=64%, Accuracy=94.1%',
    fullTextVerified: false
  },
  'p-010': {
    paperId: 'p-010',
    country: 'Nepal Himalayas (Khangri Shar, Imja, Tsho Rolpa Lakes)',
    objective: 'Implement physics-guided recurrent neural networks for Glacial Lake Outburst Flood (GLOF) early warning.',
    problem: 'Empirical lake level triggers generate excessive false alarms due to transient wind waves and thermal ice calving.',
    context: 'High-altitude proglacial moraine dammed lakes susceptible to hanging glacier avalanche impacts.',
    methodology: 'Physics-Guided LSTM (PG-LSTM) embedding hydrostatic moraine dam stability equations and lake water balance conservation.',
    dataset: 'In-situ acoustic water level probes, automated weather stations, high-resolution PlanetScope and Sentinel-2 satellite imagery (2016-2023).',
    sample: '7 years of continuous hourly sensor telemetry across 18 high-risk glacial lakes in eastern Nepal.',
    variables: 'Lake water level (m), air temperature (°C), incoming solar radiation, moraine hydrostatic pore pressure, inflow discharge.',
    model: 'PG-LSTM with dynamic physics loss regularization penalty weight (lambda = 0.35).',
    outcome: 'False alarm rate reduced by 41%; 100% detection rate for all sudden wave displacement shock events (>0.5m).',
    findings: 'Physics loss penalty prevents the recurrent network from predicting catastrophic outbursts during temporary sensor ice-buildup anomalies.',
    limitations: 'Harsh alpine climatic conditions cause frequent telemetry transmission blackouts in satellite uplink antennas.',
    researchGap: 'Edge-AI microcontroller deployments capable of running low-power quantized physics-guided neural inference locally at high-altitude lake shores.',
    statisticalMetrics: 'False Alarm Reduction=41%, Detection Rate=100%, NSE=0.92',
    fullTextVerified: false
  }
};

export const INITIAL_PROJECT: ProjectData = {
  id: 'proj-climate-ai-prisma',
  name: 'AI & Machine Learning in Climate Adaptation & Environmental Modeling',
  lastModified: new Date().toISOString(),
  activeStep: 1,
  activeMainTab: 'WORKFLOW',
  protocol: {
    title: 'Artificial Intelligence and Machine Learning in Climate Adaptation and Environmental Modeling: A PRISMA 2020 Systematic Review',
    topic: 'Systematic synthesis of deep learning, physics-informed neural networks, foundation models, and explainable AI for climate resilience, extreme weather nowcasting, flood routing, and carbon monitoring.',
    primaryObjective: 'To critically evaluate the methodological paradigms, predictive accuracy, physical consistency, and operational generalizability of modern AI/ML frameworks applied to climate hazard mitigation and environmental adaptation systems.',
    researchQuestions: [
      {
        id: 'rq-1',
        code: 'RQ1',
        question: 'Which machine learning architectures (e.g., ConvLSTM, PINNs, GNNs, Diffusion Models, Foundation Models) demonstrate highest predictive fidelity for specific climate hazard domains?',
        targetDimension: 'Architectural Performance & Domain Fit'
      },
      {
        id: 'rq-2',
        code: 'RQ2',
        question: 'How do physics-informed and explainable AI paradigms resolve physical inconsistency and operational transparency in critical hazard early warning systems?',
        targetDimension: 'Physical Consistency & Explainability'
      },
      {
        id: 'rq-3',
        code: 'RQ3',
        question: 'What are the critical methodological limitations, geographic data biases, and research gaps inhibiting operational real-world deployment across vulnerable global South regions?',
        targetDimension: 'Geographic Generalizability & Research Gaps'
      }
    ],
    inclusionCriteria: [
      'Peer-reviewed journal articles and top-tier conference proceedings published between 2020 and 2024.',
      'Explicit implementation of computational AI, deep learning, physics-informed neural networks, or machine learning pipelines.',
      'Direct application to climate adaptation, hazard nowcasting, environmental modeling, flood/wildfire/drought resilience, or carbon estimation.',
      'Provides empirical evaluation with quantitative accuracy metrics (e.g., CSI, RMSE, NSE, F1, R²).'
    ],
    exclusionCriteria: [
      'Non-peer-reviewed preprints without peer review verification (unless benchmark reference).',
      'Generic climate opinion pieces, policy commentaries, or non-computational reviews without new algorithmic evidence.',
      'Papers focusing purely on energy grid economics without explicit climate environmental physical coupling.',
      'Studies lacking documented datasets, sample bounds, or quantitative verification baselines.'
    ],
    targetDatabases: ['Scopus', 'Web of Science', 'Google Scholar', 'IEEE Xplore', 'PubMed'],
    dateRangeStart: 2020,
    dateRangeEnd: 2024,
    languageRequirements: ['English'],
    methodologicalFramework: 'PRISMA 2020'
  },
  searchStrings: [
    {
      id: 'sq-1',
      database: 'Scopus',
      syntaxType: 'Field-Tagged',
      queryString: 'TITLE-ABS-KEY(("climate adaptation" OR "climate resilience" OR "flood nowcasting" OR "wildfire risk" OR "drought monitoring") AND ("deep learning" OR "physics-informed neural" OR "graph neural network" OR "foundation model" OR "explainable AI" OR "diffusion model"))',
      fieldFilters: 'PUBYEAR > 2019 AND PUBYEAR < 2025 AND LANGUAGE(english) AND DOCTYPE(ar OR cp)',
      expectedYield: 412,
      notes: 'High precision on title/abstract/keywords across Scopus core collection.',
      dateTested: '2024-01-15'
    },
    {
      id: 'sq-2',
      database: 'Web of Science',
      syntaxType: 'Field-Tagged',
      queryString: 'TS=(("climate adaptation" OR "extreme weather" OR "coastal surge" OR "carbon sequestration") AND ("physics-informed" OR "neural network" OR "transformer" OR "multi-agent reinforcement learning"))',
      fieldFilters: 'PY=(2020-2024) AND LA=(English) AND DT=(Article OR Proceedings Paper)',
      expectedYield: 348,
      notes: 'Indexed in SCI-EXPANDED, SSCI, and ESCI.',
      dateTested: '2024-01-15'
    },
    {
      id: 'sq-3',
      database: 'IEEE Xplore',
      syntaxType: 'Boolean',
      queryString: '("Abstract":"precipitation nowcasting" OR "Abstract":"flood routing" OR "Abstract":"remote sensing climate") AND ("Abstract":"deep learning" OR "Abstract":"ConvLSTM" OR "Abstract":"GNN")',
      fieldFilters: 'Year:[2020 TO 2024], ContentType:Conferences|Journals',
      expectedYield: 184,
      notes: 'Captures specialized geospatial machine learning and remote sensing literature.',
      dateTested: '2024-01-16'
    },
    {
      id: 'sq-4',
      database: 'Google Scholar',
      syntaxType: 'Natural',
      queryString: '"deep learning" AND "climate adaptation" AND ("flood" OR "wildfire" OR "drought" OR "heat island") "systematic"',
      fieldFilters: 'Custom range: 2020-2024, patents/citations excluded',
      expectedYield: 196,
      notes: 'Broad coverage for cross-disciplinary environmental literature.',
      dateTested: '2024-01-16'
    }
  ],
  papers: INITIAL_PAPERS,
  prismaCounts: {
    recordsScopus: 412,
    recordsWos: 348,
    recordsResearchGate: 96,
    recordsScholar: 100,
    recordsPubMed: 64,
    recordsIeee: 184,
    recordsOther: 42,
    totalIdentified: 1246,
    duplicatesRemoved: 312,
    recordsScreened: 934,
    recordsExcluded: 780,
    reportsSought: 154,
    reportsNotRetrieved: 14,
    reportsAssessed: 140,
    reportsExcluded: 130,
    studiesIncluded: 10
  },
  prismaChecklist: DEFAULT_PRISMA_CHECKLIST,
  screenings: {
    'p-001': { paperId: 'p-001', humanDecision: 'INCLUDE', confidenceScore: 98, aiRecommendation: 'INCLUDE', aiConfidence: 96, aiRationale: 'Directly addresses precipitation nowcasting via deep learning with extensive multi-catchment radar benchmarks.' },
    'p-002': { paperId: 'p-002', humanDecision: 'INCLUDE', confidenceScore: 95, aiRecommendation: 'INCLUDE', aiConfidence: 98, aiRationale: 'Groundbreaking application of PINNs to coastal storm surge and shallow water hydrodynamics.' },
    'p-003': { paperId: 'p-003', humanDecision: 'INCLUDE', confidenceScore: 92, aiRecommendation: 'INCLUDE', aiConfidence: 94, aiRationale: 'Presents explainable AI (SHAP) for wildfire risk with ground telemetry and Sentinel-2 imagery.' },
    'p-004': { paperId: 'p-004', humanDecision: 'INCLUDE', confidenceScore: 94, aiRecommendation: 'INCLUDE', aiConfidence: 95, aiRationale: 'Novel graph neural network formulation for dendritic river flood routing.' },
    'p-005': { paperId: 'p-005', humanDecision: 'INCLUDE', confidenceScore: 90, aiRecommendation: 'INCLUDE', aiConfidence: 91, aiRationale: 'Addresses data scarcity in Sub-Saharan Africa using vision transformer transfer learning for drought resilience.' },
    'p-006': { paperId: 'p-006', humanDecision: 'INCLUDE', confidenceScore: 88, aiRecommendation: 'INCLUDE', aiConfidence: 89, aiRationale: 'Multi-agent reinforcement learning for urban heat island mitigation with microclimate simulation coupling.' },
    'p-007': { paperId: 'p-007', humanDecision: 'INCLUDE', confidenceScore: 96, aiRecommendation: 'INCLUDE', aiConfidence: 97, aiRationale: 'Evaluates geospatial foundation models (Clay, Prithvi) on GEDI LiDAR for tropical forest carbon estimation.' },
    'p-008': { paperId: 'p-008', humanDecision: 'INCLUDE', confidenceScore: 93, aiRecommendation: 'INCLUDE', aiConfidence: 95, aiRationale: 'Deploy score-based generative diffusion models for high-resolution climate downscaling without GAN mode collapse.' },
    'p-009': { paperId: 'p-009', humanDecision: 'INCLUDE', confidenceScore: 89, aiRecommendation: 'INCLUDE', aiConfidence: 90, aiRationale: 'Active learning for rapid post-hurricane structural damage mapping on UAV drone swarms.' },
    'p-010': { paperId: 'p-010', humanDecision: 'INCLUDE', confidenceScore: 91, aiRecommendation: 'INCLUDE', aiConfidence: 93, aiRationale: 'Physics-guided recurrent networks for high-altitude Glacial Lake Outburst Flood (GLOF) early warning.' }
  },
  qualityAssessments: {
    'p-001': {
      paperId: 'p-001',
      toolType: 'MMAT',
      studyType: 'Quantitative Non-RCT',
      criteria: [
        { id: 'c1', question: 'Are the research questions clearly stated?', score: 'YES' },
        { id: 'c2', question: 'Do the collected data allow to address the research questions?', score: 'YES' },
        { id: 'c3', question: 'Are the measurements clearly defined and validated?', score: 'YES' },
        { id: 'c4', question: 'Is the risk of nonresponse bias low or addressed?', score: 'YES' },
        { id: 'c5', question: 'Is the statistical/computational analysis appropriate?', score: 'YES' }
      ],
      overallScorePercentage: 100,
      riskOfBias: 'LOW_RISK',
      evaluatorRemarks: 'Exemplary multi-agency radar benchmark with rigorous ablation of recurrent cells and optical flow baselines.'
    },
    'p-002': {
      paperId: 'p-002',
      toolType: 'MMAT',
      studyType: 'Quantitative Non-RCT',
      criteria: [
        { id: 'c1', question: 'Are the research questions clearly stated?', score: 'YES' },
        { id: 'c2', question: 'Do the collected data allow to address the research questions?', score: 'YES' },
        { id: 'c3', question: 'Are the measurements clearly defined and validated?', score: 'YES' },
        { id: 'c4', question: 'Is the risk of nonresponse bias low or addressed?', score: 'YES' },
        { id: 'c5', question: 'Is the statistical/computational analysis appropriate?', score: 'YES' }
      ],
      overallScorePercentage: 100,
      riskOfBias: 'LOW_RISK',
      evaluatorRemarks: 'Pristine mathematical formulation of 2D shallow water equations embedded in neural loss functions.'
    },
    'p-003': {
      paperId: 'p-003',
      toolType: 'MMAT',
      studyType: 'Quantitative Descriptive',
      criteria: [
        { id: 'c1', question: 'Are the research questions clearly stated?', score: 'YES' },
        { id: 'c2', question: 'Do the collected data allow to address the research questions?', score: 'YES' },
        { id: 'c3', question: 'Are the measurements clearly defined and validated?', score: 'YES' },
        { id: 'c4', question: 'Is the risk of nonresponse bias low or addressed?', score: 'YES' },
        { id: 'c5', question: 'Is the statistical/computational analysis appropriate?', score: 'YES' }
      ],
      overallScorePercentage: 100,
      riskOfBias: 'LOW_RISK',
      evaluatorRemarks: 'Comprehensive explainability analysis via SHAP and Integrated Gradients across 8,920 fire perimeters.'
    }
  },
  evidenceExtractions: INITIAL_EXTRACTIONS,
  themes: [
    {
      id: 'theme-1',
      name: 'Spatiotemporal Deep Learning & Extreme Weather Nowcasting',
      code: 'TH-01',
      color: '#f59e0b',
      description: 'Convolutional recurrent networks and diffusion models capturing high-frequency precipitation, flood waves, and downscaling.',
      paperIds: ['p-001', 'p-004', 'p-008'],
      keyThemes: ['Recurrent ConvLSTM Cells', 'Topological Graph WaveNet', 'Diffusion Noise Schedules', 'Lead-time Attenuation'],
      synthesizedTakeaway: 'Deep architectures consistently outperform classical physics kinematics up to 90 minutes; generative diffusion eliminates GAN mode-collapse in extreme rainfall tail modeling.'
    },
    {
      id: 'theme-2',
      name: 'Physics-Informed & Physics-Guided Neural Surrogates',
      code: 'TH-02',
      color: '#06b6d4',
      description: 'Embedding differential equations and conservation laws into loss functions for fast sub-second hazard prediction.',
      paperIds: ['p-002', 'p-010'],
      keyThemes: ['Navier-Stokes Shallow Water PINNs', 'Hydrostatic Stability Regularization', 'Sub-second Inference', 'Zero Mass Inconsistency'],
      synthesizedTakeaway: 'Enforcing physical boundary and momentum constraints provides up to 380x computational speedups while eliminating unphysical artifacts.'
    },
    {
      id: 'theme-3',
      name: 'Explainability, Active Learning & Human-in-the-Loop Operations',
      code: 'TH-03',
      color: '#10b981',
      description: 'Interpretable machine learning and active sampling pipelines enabling operational deployment by civil protection agencies.',
      paperIds: ['p-003', 'p-009'],
      keyThemes: ['SHAP Local Attributions', 'Bayesian Uncertainty Sampling (BALD)', 'Labeling Budget Reduction', 'Operator Trust'],
      synthesizedTakeaway: 'Explainable AI and active learning bridge the gap between black-box models and emergency responders, cutting manual inspection workloads by over 60%.'
    },
    {
      id: 'theme-4',
      name: 'Foundation Models & Transfer Learning in Data-Sparse Regions',
      code: 'TH-04',
      color: '#8b5cf6',
      description: 'Self-supervised vision transformers and geospatial foundation models transferring planetary representations to global South ecosystems.',
      paperIds: ['p-005', 'p-006', 'p-007'],
      keyThemes: ['Geospatial Masked Autoencoders', 'Multi-Agent Reinforcement Learning', 'GEDI LiDAR Probing', 'Sub-Saharan Drought Transfer'],
      synthesizedTakeaway: 'Foundation models pre-trained on petabyte-scale satellite archives reduce ground sensor calibration requirements by 75% in historically under-monitored biomes.'
    }
  ],
  researchGaps: [
    {
      id: 'gap-1',
      code: 'GAP-01',
      title: 'Geographic and In-Situ Telemetry Disparity in the Global South',
      type: 'Population / Geographic',
      description: 'Over 70% of high-resolution climate AI benchmarks are trained exclusively on dense North American and European radar/gauge networks, creating severe domain transfer degradation when deployed in equatorial smallholder farming and tropical river basins.',
      severity: 'Critical',
      supportingPaperIds: ['p-005', 'p-007', 'p-010'],
      proposedFutureAgenda: [
        'Establish federated cross-continental benchmark datasets pairing low-cost IoT soil moisture probes with open Sentinel archives.',
        'Develop self-supervised zero-shot spatial adaptation algorithms specifically calibrated for tropical cloud cover and smallholder parcel mosaics.'
      ]
    },
    {
      id: 'gap-2',
      code: 'GAP-02',
      title: 'Dynamic Anthropogenic Infrastructure Coupling in Hydrological Models',
      type: 'Methodological',
      description: 'Existing graph neural networks and hydrodynamic surrogates assume static river channel geomorphology, ignoring real-time human control of dam spillways, hydropower bypasses, and emergency floodgate activations.',
      severity: 'Critical',
      supportingPaperIds: ['p-004', 'p-002'],
      proposedFutureAgenda: [
        'Formulate hybrid graph architectures with time-varying dynamic edge weighting driven by SCADA telemetry from reservoir operators.',
        'Integrate multi-agent reinforcement learning into catchment flood control systems to simulate coordinated inter-reservoir release schedules.'
      ]
    },
    {
      id: 'gap-3',
      code: 'GAP-03',
      title: 'Real-Time Edge-AI Deployment and High-Altitude Hardware Resilience',
      type: 'Technological',
      description: 'Complex deep learning models requiring GPU server clusters cannot operate during catastrophic storm telecommunication outages in remote alpine cryosphere environments.',
      severity: 'Moderate',
      supportingPaperIds: ['p-010', 'p-009'],
      proposedFutureAgenda: [
        'Explore 4-bit quantization and integer arithmetic optimization for physics-guided neural networks running on solar-powered edge microcontrollers.',
        'Implement resilient peer-to-peer LoRa mesh networks for decentralized early warning siren triggering directly at glacial lake shores.'
      ]
    }
  ],
  reviewDraftSections: [
    {
      id: 'sec-1',
      number: '1',
      title: 'Introduction & Problem Formulation',
      content: 'Escalating anthropogenic climate disruptions have intensified the frequency and severity of compound extreme weather events, including convective flash flooding, catastrophic coastal storm surges, mega-wildfires, and protracted agricultural droughts. Traditional numerical modeling frameworks, such as general circulation models (GCMs) and physics-based shallow water hydrodynamic solvers, exhibit prohibitive computational latency that severely restricts real-time emergency civil protection. Over the past five years, artificial intelligence and machine learning paradigms—spanning deep spatiotemporal neural networks, physics-informed neural networks (PINNs), generative diffusion models, and self-supervised geospatial foundation models—have emerged as transformative tools to bridge this gap. This systematic review provides a rigorous, PRISMA 2020-compliant synthesis of modern computational methodologies across 10 core peer-reviewed benchmark studies.',
      subsections: [
        { number: '1.1', title: 'Background and Rationale' },
        { number: '1.2', title: 'Research Questions & Objectives' }
      ]
    },
    {
      id: 'sec-2',
      number: '2',
      title: 'Methodology & PRISMA 2020 Protocol',
      content: 'This systematic review was conducted in strict adherence to the Preferred Reporting Items for Systematic Reviews and Meta-Analyses (PRISMA 2020) statement. A comprehensive multi-database search was executed across Scopus, Web of Science, IEEE Xplore, Google Scholar, and PubMed covering publications from 2020 to 2024. A standardized Boolean syntax combined climate adaptation domains with state-of-the-art computational machine learning terminology. Duplicate records were systematically resolved, followed by two-stage title/abstract and full-text screening against pre-specified inclusion and exclusion criteria. Quality assessment was executed using the Mixed Methods Appraisal Tool (MMAT), and evidence was extracted into an 18-column standardized academic data matrix.',
      subsections: [
        { number: '2.1', title: 'Eligibility Criteria & Information Sources' },
        { number: '2.2', title: 'Search Strategy & Deduplication Arithmetic' },
        { number: '2.3', title: 'Quality Assessment & Risk of Bias' }
      ]
    },
    {
      id: 'sec-3',
      number: '3',
      title: 'Deep Spatiotemporal Architectures for Extreme Hazard Nowcasting',
      content: 'Spatiotemporal deep learning frameworks have fundamentally redefined short-term hazard forecasting. In precipitation nowcasting, convolutional recurrent architectures such as ConvLSTM and PredRNN deliver Critical Success Indices of 0.68 at 2-hour horizons [SP001], outperforming optical flow kinematics by 27%. In riverine flood routing, dendritic Graph Neural Networks (Graph WaveNet) capture non-Euclidean stream channel geometries, attaining Nash-Sutcliffe efficiencies of 0.89 and reducing peak timing errors to under 35 minutes [SP004]. Furthermore, conditional score-based diffusion models (SR-DiffClimate) have effectively overcome the mode-collapse pathology of GANs, super-resolving coarse climate projections to 2km mountain grids while preserving 99.9th percentile extreme precipitation tails [SP008].',
      subsections: [
        { number: '3.1', title: 'Radar Precipitation Nowcasting & Spatiotemporal Memory' },
        { number: '3.2', title: 'Topological River Graph Networks' },
        { number: '3.3', title: 'Generative Diffusion for Climate Downscaling' }
      ]
    },
    {
      id: 'sec-4',
      number: '4',
      title: 'Physics-Informed & Physics-Guided Neural Surrogates',
      content: 'A pivotal paradigm shift in environmental AI is the integration of physical conservation laws directly into neural training objectives. Pure data-driven models frequently generate physically unviable predictions, such as spontaneous water creation at dry coastlines or negative hydrostatic pressures. The PINN-Surge framework resolves this by embedding 2D shallow water differential equations into deep neural loss functions, delivering 10m-resolution coastal inundation maps across the North Sea in 1.4 seconds with sub-decimeter error (RMSE: 0.082m) [SP002]. Similarly, Physics-Guided LSTMs incorporate moraine dam stability physics to reduce false alarm rates by 41% in Himalayan Glacial Lake Outburst Flood (GLOF) monitoring [SP010].',
      subsections: [
        { number: '4.1', title: 'Governing Equation Embedding (Navier-Stokes Surrogates)' },
        { number: '4.2', title: 'Cryospheric Moraine Stability and Outburst Modeling' }
      ]
    },
    {
      id: 'sec-5',
      number: '5',
      title: 'Explainable AI, Active Learning, and Operational Decision Support',
      content: 'Operational adoption of machine learning by emergency response commanders demands rigorous interpretability and efficient human-in-the-loop workflows. In Mediterranean wildfire mapping, coupling XGBoost with SHAP global and local attribution identified live fuel moisture (<65%) and vapor pressure deficit (>3.2 kPa) as 62% of predictive importance [SP003], granting incident commanders transparent feature verification. During post-hurricane disaster response, Bayesian Active Learning by Disagreement (BALD) on aerial UAV drone swarms reduced manual expert labeling burdens by 64% while sustaining 92.4% structural damage classification accuracy [SP009]. In urban domains, Multi-Agent Reinforcement Learning (MADDPG) demonstrated that cooperative district-scale cooling controls can lower peak urban heat island temperatures by 2.3°C [SP006].',
      subsections: [
        { number: '5.1', title: 'SHAP Feature Attribution in Fire Dynamics' },
        { number: '5.2', title: 'Bayesian Active Learning on UAV Post-Disaster Swarms' },
        { number: '5.3', title: 'Multi-Agent Cooperative Urban Thermal Control' }
      ]
    },
    {
      id: 'sec-6',
      number: '6',
      title: 'Foundation Models, Transfer Learning, and Data-Sparse Biomes',
      content: 'Self-supervised geospatial foundation models pre-trained on petabyte-scale planetary archives offer unprecedented transferability to data-sparse biomes. In pantropical rainforests, fine-tuning foundation vision transformers (Clay, Prithvi) on GEDI spaceborne LiDAR waveforms halved aboveground biomass estimation RMSE from 48.2 Mg/ha to 21.6 Mg/ha compared to standard Random Forest baselines [SP007]. In Sub-Saharan smallholder agricultural systems, pre-trained Vision Transformers fine-tuned on sparse local telemetry achieved an R² of 0.84 for 30-day drought forecasting, requiring 75% fewer in-situ calibration stations [SP005].',
      subsections: [
        { number: '6.1', title: 'Spaceborne LiDAR Carbon Sequestration Probes' },
        { number: '6.2', title: 'Sub-Saharan Drought Resilience Transfer' }
      ]
    },
    {
      id: 'sec-7',
      number: '7',
      title: 'Critical Research Gaps, Methodological Limitations & Future Directions',
      content: 'Despite remarkable predictive advances, significant research frontiers remain unresolved. First, over 70% of state-of-the-art benchmarks remain tethered to high-income Global North telemetry, leading to severe domain shift in tropical biomes. Second, existing flood and surge models treat river channels as passive static geometries, failing to account for dynamic human hydraulic infrastructure such as reservoir spillways and tidal barrages. Third, cloud connectivity dependencies limit deployment in severe storm blackouts, underscoring the urgent need for quantized edge-AI microcontrollers capable of running autonomous physics-guided inferences on solar power at remote hazard sites.',
      subsections: [
        { number: '7.1', title: 'Geographic and In-Situ Telemetry Disparity' },
        { number: '7.2', title: 'Dynamic Anthropogenic Infrastructure Modeling' },
        { number: '7.3', title: 'Quantized Edge-AI and Extreme Climate Resilience' }
      ]
    }
  ],
  reviewPaper: {
    title: 'Artificial Intelligence and Machine Learning in Climate Adaptation & Environmental Modeling: A PRISMA 2020 Systematic Review',
    runningHead: 'AI IN CLIMATE ADAPTATION & HAZARD SYNTHESIS',
    authors: ['Nurdiyana, M.', 'Ahmad, Z.', 'Hassan, R. B.', 'Chen, W. L.'],
    affiliations: ['Department of Environmental Science & Computational Analytics, Universiti Malaysia Terengganu', 'Institute of Oceanography and Environment (INOS)'],
    abstract: 'Escalating compound climate hazards necessitate rapid, physically consistent, and interpretable computational modeling for disaster mitigation. This PRISMA 2020-compliant systematic review synthesizes recent advancements in artificial intelligence and machine learning applied to climate adaptation, precipitation nowcasting, coastal storm surges, wildfire vulnerability, and agricultural drought monitoring. Across 10 core peer-reviewed benchmark studies synthesized from 1,246 initial bibliographic records, deep spatiotemporal architectures demonstrate up to 27% improvements in precipitation nowcasting lead-times [SP001], while Physics-Informed Neural Networks (PINNs) provide 380x inference acceleration for coastal flood surges with sub-decimeter error [SP002]. Explainable AI and active learning cut disaster annotation workloads by 64% [SP009], while geospatial foundation models reduce tropical biomass estimation error by over 50% [SP007]. We outline key methodological frontiers, including dynamic human infrastructure coupling and quantized edge-AI deployment for remote early warning resilience.',
    keywords: ['Artificial Intelligence', 'Climate Adaptation', 'PRISMA 2020', 'Physics-Informed Neural Networks', 'Spatiotemporal Deep Learning', 'Geospatial Foundation Models', 'Disaster Resilience'],
    sections: [
      {
        id: 'sec-p-1',
        number: '1',
        title: 'Introduction & Theoretical Motivation',
        content: 'Compound extreme weather events driven by climate volatility pose unprecedented threats to global civil infrastructure and food security. While traditional physics-based numerical simulations remain the gold standard for long-term climatology, their immense computational burden prevents sub-minute emergency response forecasting during extreme flash floods, storm surges, and wildfire ignitions. Machine learning and deep learning architectures have emerged as high-speed predictive alternatives. However, earlier black-box models frequently suffered from physical inconsistency, spatial blurriness, and lack of explainability. This systematic review synthesizes modern computational paradigms—specifically spatiotemporal recurrent networks, physics-informed neural solvers, explainable tree ensembles, generative diffusion downscaling, and geospatial foundation models—providing a structured assessment of their predictive fidelity, physical validity, and operational deployability.'
      },
      {
        id: 'sec-p-2',
        number: '2',
        title: 'Systematic Review Methodology (PRISMA 2020)',
        content: 'This review was executed following the PRISMA 2020 guidelines. A structured literature search was conducted across five major bibliographic databases (Scopus, Web of Science, IEEE Xplore, Google Scholar, and PubMed) spanning 2020 to 2024. From an initial corpus of 1,246 records, 312 duplicates were removed. Title and abstract screening was conducted on 934 unique records, followed by full-text eligibility appraisal against strict quantitative reporting criteria, resulting in 10 core benchmark studies included in the qualitative and quantitative synthesis. Quality appraisal was conducted using the Mixed Methods Appraisal Tool (MMAT), confirming low risk of bias across included quantitative benchmarks.'
      },
      {
        id: 'sec-p-3',
        number: '3',
        title: 'High-Fidelity Spatiotemporal Modeling and Extreme Nowcasting',
        content: 'Spatiotemporal deep learning has demonstrated remarkable success in tracking non-linear fluid dynamics. In radar precipitation nowcasting, convolutional recurrent models including ConvLSTM and PredRNN achieved a Critical Success Index of 0.68 at 2-hour horizons [SP001], outperforming classical optical flow kinematics by 27%. In river catchments, topological Graph Neural Networks (Graph WaveNet) effectively route flood waves along non-Euclidean stream channel bifurcations, achieving a Nash-Sutcliffe efficiency of 0.89 and limiting peak arrival timing error to under 35 minutes [SP004]. To bridge coarse 100km global climate models to local mountainous catchments, score-based conditional diffusion models (SR-DiffClimate) super-resolve precipitation projections down to 2km grids, preserving 99.9th percentile extreme precipitation tails with 89% lower Wasserstein distance than GANs [SP008].'
      },
      {
        id: 'sec-p-4',
        number: '4',
        title: 'Physics-Informed & Physics-Guided Neural Surrogates',
        content: 'To prevent unphysical artifacts such as artificial water creation at coastlines, researchers have embedded governing partial differential equations directly into deep neural loss functions. The PINN-Surge framework embeds 2D shallow water continuity and momentum Navier-Stokes equations into a multi-scale Fourier MLP, generating 10m-resolution coastal flood surge maps across the North Sea in 1.4 seconds (a 380x speedup over numerical solvers) with sub-decimeter error (RMSE: 0.082m) [SP002]. Similarly, Physics-Guided LSTMs incorporating moraine dam hydrostatic stability equations cut false alarm rates by 41% while maintaining 100% detection of sudden lake displacement shockwaves in Himalayan Glacial Lake Outburst Flood (GLOF) monitoring [SP010].'
      },
      {
        id: 'sec-p-5',
        number: '5',
        title: 'Explainable AI, Human-in-the-Loop Active Learning & Urban Adaptation',
        content: 'Operational adoption by emergency managers requires transparency and rapid human collaboration. In Mediterranean wildfire modeling, XGBoost combined with SHAP feature attribution revealed that live fuel moisture content below 65% and vapor pressure deficit above 3.2 kPa contributed 62% of predictive importance [SP003], providing actionable spatial transparency for firefighting commanders. In hurricane disaster response, Bayesian Active Learning on UAV drone swarms cut human image labeling burdens by 64% while sustaining 92.4% structural damage classification accuracy [SP009]. At the urban scale, Multi-Agent Deep Deterministic Policy Gradient (MADDPG) algorithms coordinated district-wide green roof irrigation and dynamic facade shading, lowering canopy heat island temperatures by 2.3°C and cutting cooling energy demand by 18.4% [SP006].'
      },
      {
        id: 'sec-p-6',
        number: '6',
        title: 'Geospatial Foundation Models and Transfer Learning in Data-Sparse Regions',
        content: 'Geospatial foundation models pre-trained on multi-spectral satellite imagery provide unprecedented zero-shot transfer capabilities for data-sparse global South regions. In tropical rainforests, fine-tuning the Prithvi and Clay foundation models on spaceborne GEDI LiDAR waveforms reduced aboveground biomass estimation RMSE from 48.2 Mg/ha to 21.6 Mg/ha compared to standard Random Forest baselines [SP007]. In Sub-Saharan Africa, fine-tuned Vision Transformers trained on sparse in-situ telemetry delivered an R² of 0.84 for 30-day agricultural drought forecasting, requiring 75% fewer local ground calibration stations [SP005].'
      },
      {
        id: 'sec-p-7',
        number: '7',
        title: 'Synthesis, Open Gaps, and Strategic Research Agenda',
        content: 'Despite these computational milestones, our systematic synthesis highlights three critical frontiers. First, severe geographic telemetry disparities persist: over 70% of benchmark datasets originate from high-income Northern Hemisphere regions [SP005, SP007, SP010]. Second, existing hydrodynamic neural models treat river catchments as passive static systems, omitting real-time human control of dam spillways and floodgates [SP004, SP002]. Third, dependency on cloud server farms creates severe vulnerability during storm-induced power outages, highlighting the urgent need for quantized edge-AI models deployed directly on low-power microcontrollers at remote mountain and coastal sites [SP010, SP009].'
      }
    ],
    references: [
      { paperId: 'p-001', citationKey: '[SP001]', formattedReference: 'Chen, W., Martinez, E., Kowalski, P., & Zhang, L. (2023). Deep Learning Architectures for Extreme Precipitation Nowcasting: A Multi-Radar Synthesis. IEEE Transactions on Geoscience and Remote Sensing, 61, 102-118.', doi: '10.1109/TGRS.2023.3289012', year: 2023, authors: 'Chen et al.' },
      { paperId: 'p-002', citationKey: '[SP002]', formattedReference: 'Vanderbilt, S., Gupta, R., & Al-Mansoor, T. (2024). Physics-Informed Neural Networks for High-Resolution Coastal Inundation Surges. Nature Climate Change, 14(2), 189-204.', doi: '10.1038/s41558-024-01945-8', year: 2024, authors: 'Vanderbilt et al.' },
      { paperId: 'p-003', citationKey: '[SP003]', formattedReference: 'Johansson, M., Dubois, C., & Nielsen, A. (2023). Explainable AI for Wildfire Risk Mapping and Forest Fuel Moisture Estimation. Remote Sensing of Environment, 295, 113689.', doi: '10.1016/j.rse.2023.113689', year: 2023, authors: 'Johansson et al.' },
      { paperId: 'p-004', citationKey: '[SP004]', formattedReference: 'Tanaka, H., O\'Connor, B., & Sato, K. (2022). Graph Neural Networks for River Catchment Flood Routing and Hydrological Connectivity. Water Resources Research, 58(9), e2022WR031940.', doi: '10.1029/2022WR031940', year: 2022, authors: 'Tanaka et al.' },
      { paperId: 'p-005', citationKey: '[SP005]', formattedReference: 'Osei, K., Adebayo, F., & Mthembu, S. (2024). Transfer Learning for Agricultural Drought Resilience in Data-Scarce Sub-Saharan Regions. Environmental Research Letters, 19(3), 034012.', doi: '10.1088/1748-9326/ad2901', year: 2024, authors: 'Osei et al.' },
      { paperId: 'p-006', citationKey: '[SP006]', formattedReference: 'Schmidt, M., Bauer, L., & Weber, F. (2023). Multi-Agent Reinforcement Learning for Urban Microclimate Heat Island Mitigation. Building and Environment, 242, 110592.', doi: '10.1016/j.buildenv.2023.110592', year: 2023, authors: 'Schmidt et al.' },
      { paperId: 'p-007', citationKey: '[SP007]', formattedReference: 'Laurent, S., Morales, C., Gomez, A., & Silva, L. (2024). Benchmarking Foundation Models for Carbon Sequestration and Forest Biomass Estimation. Global Change Biology, 30(5), e17240.', doi: '10.1111/gcb.17240', year: 2024, authors: 'Laurent et al.' },
      { paperId: 'p-008', citationKey: '[SP008]', formattedReference: 'Kim, D.-H., Park, J.-H., & Lee, S.-W. (2023). Deep Generative Diffusion Models for High-Resolution Climate Downscaling. Journal of Climate, 36(21), 7611-7629.', doi: '10.1175/JCLI-D-23-0182.1', year: 2023, authors: 'Kim et al.' },
      { paperId: 'p-009', citationKey: '[SP009]', formattedReference: 'Haddad, R., Khoury, Z., & Mansour, F. (2022). Active Learning for Rapid Post-Disaster Damage Assessment via Aerial Imagery. International Journal of Disaster Risk Reduction, 80, 103218.', doi: '10.1016/j.ijdrr.2022.103218', year: 2022, authors: 'Haddad et al.' },
      { paperId: 'p-010', citationKey: '[SP010]', formattedReference: 'Bhattarai, R., Sharma, P., & Karki, S. (2024). Physics-Guided Recurrent Networks for Glacial Lake Outburst Flood (GLOF) Early Warning. Journal of Hydrology: Regional Studies, 52, 101684.', doi: '10.1016/j.ejrh.2024.101684', year: 2024, authors: 'Bhattarai et al.' }
    ]
  },
  supportedClaims: [
    {
      id: 'cl-1',
      claimText: 'Convolutional recurrent architectures attain CSI of 0.68 at 2-hour lead time, exceeding classical optical flow by 27%.',
      status: 'supported',
      evidenceText: 'Multi-radar benchmark across 5 European catchments recorded CSI=0.68 vs optical flow baseline (0.53).',
      supportingPaperIds: ['p-001'],
      sectionId: 'sec-p-3',
      confidenceScore: 98
    },
    {
      id: 'cl-2',
      claimText: 'PINN-Surge produces 10m-resolution coastal flood surge maps in 1.4s with sub-decimeter RMSE (0.082m).',
      status: 'supported',
      evidenceText: 'Navier-Stokes shallow water continuity loss enabled 380x computational speedup with RMSE=0.082m.',
      supportingPaperIds: ['p-002'],
      sectionId: 'sec-p-4',
      confidenceScore: 99
    },
    {
      id: 'cl-3',
      claimText: 'SHAP feature attribution identifies fuel moisture (<65%) and VPD (>3.2 kPa) as 62% of wildfire ignition importance.',
      status: 'supported',
      evidenceText: 'TreeExplainer local attribution across 8,920 Mediterranean fire perimeters.',
      supportingPaperIds: ['p-003'],
      sectionId: 'sec-p-5',
      confidenceScore: 95
    },
    {
      id: 'cl-4',
      claimText: 'Graph WaveNet models river flood routing with NSE=0.89 and peak timing error under 35 minutes.',
      status: 'supported',
      evidenceText: 'Evaluated across 482 gauging stations in Tone and Rhine river basins.',
      supportingPaperIds: ['p-004'],
      sectionId: 'sec-p-3',
      confidenceScore: 96
    },
    {
      id: 'cl-5',
      claimText: 'Transfer learning with Vision Transformers achieves R²=0.84 for Sub-Saharan drought forecasting with 75% fewer ground calibration stations.',
      status: 'supported',
      evidenceText: 'Fine-tuned ViT-B/16 pre-trained on global MODIS/ERA5 records in Kenya and Ghana.',
      supportingPaperIds: ['p-005'],
      sectionId: 'sec-p-6',
      confidenceScore: 91
    },
    {
      id: 'cl-6',
      claimText: 'Score-based diffusion downscaling preserves 99.9th percentile extreme precipitation with 89% lower Wasserstein distance than GANs.',
      status: 'supported',
      evidenceText: 'Conditioned on CMIP6 100km thermodynamic states super-resolved to 2km Alpine terrain.',
      supportingPaperIds: ['p-008'],
      sectionId: 'sec-p-3',
      confidenceScore: 94
    },
    {
      id: 'cl-7',
      claimText: 'Bayesian Active Learning cuts post-disaster manual aerial image labeling by 64% while maintaining 92.4% F1-score.',
      status: 'supported',
      evidenceText: 'BALD sampling on 12,000 damaged building structures across Caribbean hurricane strikes.',
      supportingPaperIds: ['p-009'],
      sectionId: 'sec-p-5',
      confidenceScore: 93
    },
    {
      id: 'cl-8',
      claimText: 'Physics-guided loss regularization cuts Glacial Lake Outburst Flood false alarm rates by 41% in the Himalayas.',
      status: 'supported',
      evidenceText: 'PG-LSTM with moraine dam hydrostatic stability penalty evaluated across 18 lakes.',
      supportingPaperIds: ['p-010'],
      sectionId: 'sec-p-4',
      confidenceScore: 92
    }
  ]
};
