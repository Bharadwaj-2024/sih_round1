export type Language = "en" | "hi" | "ta" | "te" | "kn" | "mr"

export interface Translations {
  // Common
  loading: string
  cancel: string
  submit: string
  save: string
  edit: string
  delete: string
  close: string
  search: string
  filter: string

  // Authentication
  signIn: string
  signOut: string
  email: string
  password: string
  aadhaarNumber: string
  selectRole: string
  citizen: string
  administrator: string

  // Navigation
  dashboard: string
  overview: string
  issues: string
  mapView: string
  analytics: string

  // Issue Management
  reportNewIssue: string
  issueTitle: string
  description: string
  category: string
  location: string
  urgency: string
  status: string
  pending: string
  inProgress: string
  resolved: string
  high: string
  medium: string
  low: string

  // Categories
  roads: string
  electricity: string
  sanitation: string
  water: string
  traffic: string
  other: string

  // Stats
  myReports: string
  totalIssues: string
  communityImpact: string
  resolutionRate: string

  // Actions
  upvote: string
  comment: string
  viewDetails: string
  assignDepartment: string

  // Messages
  welcomeMessage: string
  noIssuesFound: string
  issueReportedSuccessfully: string
}

export const translations: Record<Language, Translations> = {
  en: {
    // Common
    loading: "Loading...",
    cancel: "Cancel",
    submit: "Submit",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    close: "Close",
    search: "Search",
    filter: "Filter",

    // Authentication
    signIn: "Sign In",
    signOut: "Sign Out",
    email: "Email Address",
    password: "Password",
    aadhaarNumber: "Aadhaar Number",
    selectRole: "Select Role",
    citizen: "Citizen",
    administrator: "Administrator",

    // Navigation
    dashboard: "Dashboard",
    overview: "Overview",
    issues: "Issues",
    mapView: "Map View",
    analytics: "Analytics",

    // Issue Management
    reportNewIssue: "Report New Issue",
    issueTitle: "Issue Title",
    description: "Description",
    category: "Category",
    location: "Location",
    urgency: "Urgency",
    status: "Status",
    pending: "Pending",
    inProgress: "In Progress",
    resolved: "Resolved",
    high: "High",
    medium: "Medium",
    low: "Low",

    // Categories
    roads: "Roads & Infrastructure",
    electricity: "Electricity",
    sanitation: "Sanitation & Waste",
    water: "Water Supply",
    traffic: "Traffic & Transport",
    other: "Other",

    // Stats
    myReports: "My Reports",
    totalIssues: "Total Issues",
    communityImpact: "Community Impact",
    resolutionRate: "Resolution Rate",

    // Actions
    upvote: "Upvote",
    comment: "Comment",
    viewDetails: "View Details",
    assignDepartment: "Assign Department",

    // Messages
    welcomeMessage: "Welcome to CivicConnect",
    noIssuesFound: "No issues found matching your criteria",
    issueReportedSuccessfully: "Issue reported successfully! You will receive updates on its status.",
  },

  hi: {
    // Common
    loading: "लोड हो रहा है...",
    cancel: "रद्द करें",
    submit: "जमा करें",
    save: "सेव करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    close: "बंद करें",
    search: "खोजें",
    filter: "फिल्टर",

    // Authentication
    signIn: "साइन इन करें",
    signOut: "साइन आउट",
    email: "ईमेल पता",
    password: "पासवर्ड",
    aadhaarNumber: "आधार नंबर",
    selectRole: "भूमिका चुनें",
    citizen: "नागरिक",
    administrator: "प्रशासक",

    // Navigation
    dashboard: "डैशबोर्ड",
    overview: "अवलोकन",
    issues: "समस्याएं",
    mapView: "मैप व्यू",
    analytics: "विश्लेषण",

    // Issue Management
    reportNewIssue: "नई समस्या रिपोर्ट करें",
    issueTitle: "समस्या का शीर्षक",
    description: "विवरण",
    category: "श्रेणी",
    location: "स्थान",
    urgency: "तात्कालिकता",
    status: "स्थिति",
    pending: "लंबित",
    inProgress: "प्रगति में",
    resolved: "हल हो गया",
    high: "उच्च",
    medium: "मध्यम",
    low: "कम",

    // Categories
    roads: "सड़क और बुनियादी ढांचा",
    electricity: "बिजली",
    sanitation: "स्वच्छता और कचरा",
    water: "पानी की आपूर्ति",
    traffic: "यातायात और परिवहन",
    other: "अन्य",

    // Stats
    myReports: "मेरी रिपोर्ट्स",
    totalIssues: "कुल समस्याएं",
    communityImpact: "सामुदायिक प्रभाव",
    resolutionRate: "समाधान दर",

    // Actions
    upvote: "अपवोट",
    comment: "टिप्पणी",
    viewDetails: "विवरण देखें",
    assignDepartment: "विभाग असाइन करें",

    // Messages
    welcomeMessage: "CivicConnect में आपका स्वागत है",
    noIssuesFound: "आपके मानदंडों से मेल खाने वाली कोई समस्या नहीं मिली",
    issueReportedSuccessfully: "समस्या सफलतापूर्वक रिपोर्ट की गई! आपको इसकी स्थिति पर अपडेट मिलेंगे।",
  },

  ta: {
    // Common
    loading: "ஏற்றுகிறது...",
    cancel: "ரத்து செய்",
    submit: "சமர்ப்பிக்கவும்",
    save: "சேமிக்கவும்",
    edit: "திருத்து",
    delete: "நீக்கு",
    close: "மூடு",
    search: "தேடு",
    filter: "வடிகட்டி",

    // Authentication
    signIn: "உள்நுழைய",
    signOut: "வெளியேறு",
    email: "மின்னஞ்சல் முகவரி",
    password: "கடவுச்சொல்",
    aadhaarNumber: "ஆதார் எண்",
    selectRole: "பங்கு தேர்ந்தெடுக்கவும்",
    citizen: "குடிமகன்",
    administrator: "நிர்வாகி",

    // Navigation
    dashboard: "டாஷ்போர்டு",
    overview: "கண்ணோட்டம்",
    issues: "பிரச்சினைகள்",
    mapView: "வரைபட காட்சி",
    analytics: "பகுப்பாய்வு",

    // Issue Management
    reportNewIssue: "புதிய பிரச்சினையை புகாரளிக்கவும்",
    issueTitle: "பிரச்சினை தலைப்பு",
    description: "விளக்கம்",
    category: "வகை",
    location: "இடம்",
    urgency: "அவசரம்",
    status: "நிலை",
    pending: "நிலுவையில்",
    inProgress: "முன்னேற்றத்தில்",
    resolved: "தீர்க்கப்பட்டது",
    high: "உயர்",
    medium: "நடுத்தர",
    low: "குறைந்த",

    // Categories
    roads: "சாலைகள் மற்றும் உள்கட்டமைப்பு",
    electricity: "மின்சாரம்",
    sanitation: "சுகாதாரம் மற்றும் கழிவு",
    water: "நீர் வழங்கல்",
    traffic: "போக்குவரத்து மற்றும் போக்குவரத்து",
    other: "மற்றவை",

    // Stats
    myReports: "எனது அறிக்கைகள்",
    totalIssues: "மொத்த பிரச்சினைகள்",
    communityImpact: "சமூக தாக்கம்",
    resolutionRate: "தீர்வு விகிதம்",

    // Actions
    upvote: "ஆதரவு வாக்கு",
    comment: "கருத்து",
    viewDetails: "விவரங்களைப் பார்க்கவும்",
    assignDepartment: "துறையை ஒதுக்கவும்",

    // Messages
    welcomeMessage: "CivicConnect க்கு வரவேற்கிறோம்",
    noIssuesFound: "உங்கள் அளவுகோல்களுக்கு பொருந்தும் பிரச்சினைகள் எதுவும் கிடைக்கவில்லை",
    issueReportedSuccessfully: "பிரச்சினை வெற்றிகரமாக புகாரளிக்கப்பட்டது! அதன் நிலை குறித்த புதுப்பிப்புகளை நீங்கள் பெறுவீர்கள்.",
  },

  te: {
    // Common
    loading: "లోడ్ అవుతోంది...",
    cancel: "రద్దు చేయండి",
    submit: "సమర్పించండి",
    save: "సేవ్ చేయండి",
    edit: "సవరించండి",
    delete: "తొలగించండి",
    close: "మూసివేయండి",
    search: "వెతకండి",
    filter: "ఫిల్టర్",

    // Authentication
    signIn: "సైన్ ఇన్ చేయండి",
    signOut: "సైన్ అవుట్",
    email: "ఇమెయిల్ చిరునామా",
    password: "పాస్‌వర్డ్",
    aadhaarNumber: "ఆధార్ నంబర్",
    selectRole: "పాత్రను ఎంచుకోండి",
    citizen: "పౌరుడు",
    administrator: "నిర్వాహకుడు",

    // Navigation
    dashboard: "డాష్‌బోర్డ్",
    overview: "అవలోకనం",
    issues: "సమస్యలు",
    mapView: "మ్యాప్ వ్యూ",
    analytics: "విశ్లేషణలు",

    // Issue Management
    reportNewIssue: "కొత్త సమస్యను నివేదించండి",
    issueTitle: "సమస్య శీర్షిక",
    description: "వివరణ",
    category: "వర్గం",
    location: "స్థానం",
    urgency: "అత్యవసరత",
    status: "స్థితి",
    pending: "పెండింగ్‌లో",
    inProgress: "పురోగతిలో",
    resolved: "పరిష్కరించబడింది",
    high: "అధిక",
    medium: "మధ్యస్థ",
    low: "తక్కువ",

    // Categories
    roads: "రోడ్లు మరియు మౌలిక సదుపాయాలు",
    electricity: "విద్యుత్",
    sanitation: "పరిశుభ్రత మరియు వ్యర్థాలు",
    water: "నీటి సరఫరా",
    traffic: "ట్రాఫిక్ మరియు రవాణా",
    other: "ఇతర",

    // Stats
    myReports: "నా నివేదికలు",
    totalIssues: "మొత్తం సమస్యలు",
    communityImpact: "కమ్యూనిటీ ప్రభావం",
    resolutionRate: "పరిష్కార రేటు",

    // Actions
    upvote: "అప్‌వోట్",
    comment: "వ్యాఖ్య",
    viewDetails: "వివరాలను చూడండి",
    assignDepartment: "విభాగాన్ని కేటాయించండి",

    // Messages
    welcomeMessage: "CivicConnect కు స్వాగతం",
    noIssuesFound: "మీ ప్రమాణాలకు సరిపోలే సమస్యలు ఏవీ కనుగొనబడలేదు",
    issueReportedSuccessfully: "సమస్య విజయవంతంగా నివేదించబడింది! దాని స్థితిపై మీకు అప్‌డేట్‌లు అందుతాయి.",
  },

  kn: {
    // Common
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    cancel: "ರದ್ದುಗೊಳಿಸಿ",
    submit: "ಸಲ್ಲಿಸಿ",
    save: "ಉಳಿಸಿ",
    edit: "ಸಂಪಾದಿಸಿ",
    delete: "ಅಳಿಸಿ",
    close: "ಮುಚ್ಚಿ",
    search: "ಹುಡುಕಿ",
    filter: "ಫಿಲ್ಟರ್",

    // Authentication
    signIn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
    signOut: "ಸೈನ್ ಔಟ್",
    email: "ಇಮೇಲ್ ವಿಳಾಸ",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    aadhaarNumber: "ಆಧಾರ್ ಸಂಖ್ಯೆ",
    selectRole: "ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    citizen: "ನಾಗರಿಕ",
    administrator: "ನಿರ್ವಾಹಕ",

    // Navigation
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    overview: "ಅವಲೋಕನ",
    issues: "ಸಮಸ್ಯೆಗಳು",
    mapView: "ನಕ್ಷೆ ವೀಕ್ಷಣೆ",
    analytics: "ವಿಶ್ಲೇಷಣೆ",

    // Issue Management
    reportNewIssue: "ಹೊಸ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ",
    issueTitle: "ಸಮಸ್ಯೆಯ ಶೀರ್ಷಿಕೆ",
    description: "ವಿವರಣೆ",
    category: "ವರ್ಗ",
    location: "ಸ್ಥಳ",
    urgency: "ತುರ್ತು",
    status: "ಸ್ಥಿತಿ",
    pending: "ಬಾಕಿ",
    inProgress: "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    resolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    high: "ಹೆಚ್ಚು",
    medium: "ಮಧ್ಯಮ",
    low: "ಕಡಿಮೆ",

    // Categories
    roads: "ರಸ್ತೆಗಳು ಮತ್ತು ಮೂಲಸೌಕರ್ಯ",
    electricity: "ವಿದ್ಯುತ್",
    sanitation: "ನೈರ್ಮಲ್ಯ ಮತ್ತು ತ್ಯಾಜ್ಯ",
    water: "ನೀರಿನ ಪೂರೈಕೆ",
    traffic: "ಸಂಚಾರ ಮತ್ತು ಸಾರಿಗೆ",
    other: "ಇತರೆ",

    // Stats
    myReports: "ನನ್ನ ವರದಿಗಳು",
    totalIssues: "ಒಟ್ಟು ಸಮಸ್ಯೆಗಳು",
    communityImpact: "ಸಮುದಾಯದ ಪ್ರಭಾವ",
    resolutionRate: "ಪರಿಹಾರ ದರ",

    // Actions
    upvote: "ಅಪ್‌ವೋಟ್",
    comment: "ಕಾಮೆಂಟ್",
    viewDetails: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    assignDepartment: "ವಿಭಾಗವನ್ನು ನಿಯೋಜಿಸಿ",

    // Messages
    welcomeMessage: "CivicConnect ಗೆ ಸ್ವಾಗತ",
    noIssuesFound: "ನಿಮ್ಮ ಮಾನದಣ್ಡಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಯಾವುದೇ ಸಮಸ್ಯೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    issueReportedSuccessfully: "ಸಮಸ್ಯೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ವರದಿ ಮಾಡಲಾಗಿದೆ! ಅದರ ಸ್ಥಿತಿಯ ಕುರಿತು ನೀವು ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಸ್ವೀಕರಿಸುತ್ತೀರಿ.",
  },

  mr: {
    // Common
    loading: "लोड होत आहे...",
    cancel: "रद्द करा",
    submit: "सबमिट करा",
    save: "सेव्ह करा",
    edit: "संपादित करा",
    delete: "हटवा",
    close: "बंद करा",
    search: "शोधा",
    filter: "फिल्टर",

    // Authentication
    signIn: "साइन इन करा",
    signOut: "साइन आउट",
    email: "ईमेल पत्ता",
    password: "पासवर्ड",
    aadhaarNumber: "आधार क्रमांक",
    selectRole: "भूमिका निवडा",
    citizen: "नागरिक",
    administrator: "प्रशासक",

    // Navigation
    dashboard: "डॅशबोर्ड",
    overview: "विहंगावलोकन",
    issues: "समस्या",
    mapView: "नकाशा दृश्य",
    analytics: "विश्लेषण",

    // Issue Management
    reportNewIssue: "नवीन समस्या नोंदवा",
    issueTitle: "समस्येचे शीर्षक",
    description: "वर्णन",
    category: "श्रेणी",
    location: "स्थान",
    urgency: "तातडीची",
    status: "स्थिती",
    pending: "प्रलंबित",
    inProgress: "प्रगतीत",
    resolved: "निराकरण झाले",
    high: "उच्च",
    medium: "मध्यम",
    low: "कमी",

    // Categories
    roads: "रस्ते आणि पायाभूत सुविधा",
    electricity: "वीज",
    sanitation: "स्वच्छता आणि कचरा",
    water: "पाणी पुरवठा",
    traffic: "वाहतूक आणि परिवहन",
    other: "इतर",

    // Stats
    myReports: "माझे अहवाल",
    totalIssues: "एकूण समस्या",
    communityImpact: "समुदायिक प्रभाव",
    resolutionRate: "निराकरण दर",

    // Actions
    upvote: "अपवोट",
    comment: "टिप्पणी",
    viewDetails: "तपशील पहा",
    assignDepartment: "विभाग नियुक्त करा",

    // Messages
    welcomeMessage: "CivicConnect मध्ये आपले स्वागत आहे",
    noIssuesFound: "आपल्या निकषांशी जुळणाऱ्या कोणत्याही समस्या आढळल्या नाहीत",
    issueReportedSuccessfully: "समस्या यशस्वीरित्या नोंदवली गेली! त्याच्या स्थितीबद्दल तुम्हाला अपडेट्स मिळतील.",
  },
}

export const languageNames: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  ta: "தமிழ்",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
  mr: "मराठी",
}
