// services/lessonData.js — Micro-learning lesson content database

export const SUBJECTS = {
  Mathematics: {
    color: 'from-brand-400 to-brand-600',
    lightGradient: 'from-brand-50 to-emerald-50',
    icon: '📐',
    bg: 'bg-brand-50',
    text: 'text-brand-600',
    border: 'border-brand-200',
    badge: 'bg-brand-100 text-brand-700',
  },
  Science: {
    color: 'from-indigo-400 to-indigo-600',
    lightGradient: 'from-indigo-50 to-blue-50',
    icon: '🔬',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  English: {
    color: 'from-purple-400 to-purple-600',
    lightGradient: 'from-purple-50 to-pink-50',
    icon: '📚',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
  },
};

export const LESSONS = [
  // ══════════════════════════════════════
  // MATHEMATICS — Chapter: Fractions
  // ══════════════════════════════════════
  {
    id: 'math-fractions-1',
    subject: 'Mathematics',
    chapter: 'Fractions',
    chapterOrder: 1,
    lessonOrder: 1,
    title: 'What Are Fractions?',
    titleMr: 'अपूर्णांक म्हणजे काय?',
    titleHi: 'भिन्न क्या होते हैं?',
    duration: 15,
    xpReward: 50,
    difficulty: 'easy',
    concept: {
      text: `A **fraction** represents a part of a whole. When you divide something into equal parts, each part is a fraction.\n\nEvery fraction has two parts:\n• **Numerator** (top number) — how many parts you have\n• **Denominator** (bottom number) — total equal parts the whole is divided into\n\nExample: In **3/4**, the numerator is 3 and the denominator is 4. It means "3 out of 4 equal parts."`,
      textMr: `**अपूर्णांक** म्हणजे एखाद्या संपूर्ण गोष्टीचा एक भाग. जेव्हा आपण एखादी गोष्ट समान भागांत विभाजित करतो, तेव्हा प्रत्येक भाग हा अपूर्णांक असतो.\n\nप्रत्येक अपूर्णांकाचे दोन भाग असतात:\n• **अंश** (वरचा अंक) — तुमच्याकडे किती भाग आहेत\n• **हर** (खालचा अंक) — एकूण समान भागांची संख्या\n\nउदाहरण: **३/४** मध्ये अंश ३ आणि हर ४ आहे. याचा अर्थ "४ समान भागांपैकी ३ भाग."`,
      textHi: `**भिन्न** किसी पूरी चीज़ के एक हिस्से को दर्शाता है। जब हम किसी चीज़ को बराबर भागों में बाँटते हैं, तो हर भाग एक भिन्न होता है।\n\nहर भिन्न के दो हिस्से होते हैं:\n• **अंश** (ऊपर का अंक) — आपके पास कितने भाग हैं\n• **हर** (नीचे का अंक) — कुल बराबर भाग\n\nउदाहरण: **३/४** में अंश ३ और हर ४ है। इसका मतलब है "४ बराबर भागों में से ३ भाग।"`,
      simplifiedText: `🍕 Imagine a pizza cut into 4 equal slices.\nIf you eat 3 slices → you ate **3/4** of the pizza!\n\n3 = slices you ate (Numerator)\n4 = total slices (Denominator)\n\nSimple rule: **What you have ÷ Total parts = Fraction**`,
      simplifiedTextMr: `🍕 एक पिझ्झा ४ समान तुकड्यांमध्ये कापलेला आहे असे समजा.\nजर तुम्ही ३ तुकडे खाल्ले → तुम्ही पिझ्झाचा **३/४** भाग खाल्ला!\n\n३ = तुम्ही खाल्लेले तुकडे (अंश)\n४ = एकूण तुकडे (हर)\n\nसोपा नियम: **तुमचे भाग ÷ एकूण भाग = अपूर्णांक**`,
      steps: [
        {
          step: 1,
          title: 'Find the Whole',
          titleMr: 'संपूर्ण ओळखा',
          text: 'Look at what is being divided — a pizza, chocolate bar, or a group of objects. That is your "whole."',
          textMr: 'काय विभाजित होत आहे ते पहा — पिझ्झा, चॉकलेट, किंवा वस्तूंचा गट. तेच तुमचे "संपूर्ण" आहे.',
        },
        {
          step: 2,
          title: 'Count Total Equal Parts',
          titleMr: 'एकूण समान भाग मोजा',
          text: 'Count how many equal parts the whole is divided into. Write this at the BOTTOM → it becomes the Denominator.',
          textMr: 'संपूर्ण किती समान भागांमध्ये विभाजित आहे ते मोजा. हे तळाशी लिहा → तो हर (denominator) बनतो.',
        },
        {
          step: 3,
          title: 'Count Your Parts',
          titleMr: 'तुमचे भाग मोजा',
          text: 'Count how many parts you are talking about. Write this at the TOP → it becomes the Numerator.',
          textMr: 'तुम्ही किती भागांबद्दल बोलत आहात ते मोजा. हे वरती लिहा → तो अंश (numerator) बनतो.',
        },
        {
          step: 4,
          title: 'Write the Fraction',
          titleMr: 'अपूर्णांक लिहा',
          text: 'Place the numerator over the denominator with a line between them. E.g., 3 over 4 = 3/4.',
          textMr: 'अंश आणि हर यांच्यामध्ये एक रेषा ठेवून लिहा. उदा., ३ वर ४ खाली = ३/४.',
        },
      ],
    },
    practice: {
      questions: [
        {
          id: 'q1',
          question: 'A pizza is cut into 8 slices. Sara eats 3 slices. What fraction did Sara eat?',
          questionMr: 'एक पिझ्झा ८ तुकड्यांत कापला आहे. सारा ३ तुकडे खाते. सारानी किती अपूर्णांक खाल्ला?',
          options: ['3/5', '3/8', '8/3', '5/8'],
          answer: 1,
          explanation: 'Sara ate 3 out of 8 total slices. Fraction = numerator/denominator = 3/8.',
          explanationMr: 'सारानी ८ पैकी ३ तुकडे खाल्ले. अपूर्णांक = अंश/हर = ३/८.',
        },
        {
          id: 'q2',
          question: 'In the fraction 7/12, what is the denominator?',
          questionMr: '७/१२ या अपूर्णांकात हर कोणता आहे?',
          options: ['7', '12', '19', '5'],
          answer: 1,
          explanation: 'The denominator is the bottom number of a fraction. In 7/12, the bottom number is 12.',
          explanationMr: 'हर हा अपूर्णांकातील खालचा अंक आहे. ७/१२ मध्ये खालचा अंक १२ आहे.',
        },
        {
          id: 'q3',
          question: 'A class has 30 students. 18 are boys. What fraction of the class are boys?',
          questionMr: 'एका वर्गात ३० विद्यार्थी आहेत. १८ मुले आहेत. वर्गाचा किती अपूर्णांक मुले आहेत?',
          options: ['18/12', '12/30', '18/30', '30/18'],
          answer: 2,
          explanation: '18 boys out of 30 total students = 18/30. The whole (denominator) is 30.',
          explanationMr: '३० पैकी १८ मुले = १८/३०. एकूण (हर) ३० आहे.',
        },
        {
          id: 'q4',
          question: 'Which fraction represents "one half"?',
          questionMr: '"अर्धा" कोणता अपूर्णांक दर्शवतो?',
          options: ['2/1', '1/4', '1/2', '2/4'],
          answer: 2,
          explanation: '1/2 means 1 out of 2 equal parts, which is exactly "one half."',
          explanationMr: '१/२ म्हणजे २ समान भागांपैकी १ भाग, जो "अर्धा" आहे.',
        },
        {
          id: 'q5',
          question: 'What fraction of a week are 3 days?',
          questionMr: 'आठवड्याचा किती अपूर्णांक म्हणजे ३ दिवस?',
          options: ['3/5', '4/7', '3/7', '7/3'],
          answer: 2,
          explanation: 'A week has 7 days. 3 days out of 7 = 3/7.',
          explanationMr: 'एका आठवड्यात ७ दिवस असतात. ७ पैकी ३ दिवस = ३/७.',
        },
        {
          id: 'q6',
          question: 'Which of these is the LARGEST fraction?',
          questionMr: 'यापैकी कोणता सर्वात मोठा अपूर्णांक आहे?',
          options: ['1/8', '1/3', '1/2', '1/10'],
          answer: 2,
          explanation: 'When numerators are equal (all 1), the smallest denominator gives the largest fraction. 1/2 has the smallest denominator (2), so it is the largest.',
          explanationMr: 'जेव्हा अंश समान असतात (सर्व १), सर्वात लहान हर सर्वात मोठा अपूर्णांक देतो. १/२ चा हर सर्वात लहान (२) आहे.',
        },
      ],
    },
    revision: {
      points: [
        'A fraction = part of a whole, written as numerator/denominator',
        'Numerator (top) = parts you have',
        'Denominator (bottom) = total equal parts',
        'Larger denominator means each part is smaller',
        'Same numerator: smaller denominator → bigger fraction',
      ],
      pointsMr: [
        'अपूर्णांक = संपूर्णाचा भाग, अंश/हर स्वरूपात लिहितात',
        'अंश (वर) = तुमच्याकडील भाग',
        'हर (खाली) = एकूण समान भाग',
        'मोठा हर म्हणजे प्रत्येक भाग लहान',
        'समान अंश: लहान हर → मोठा अपूर्णांक',
      ],
    },
  },

  // Lesson 2 — Adding Fractions
  {
    id: 'math-fractions-2',
    subject: 'Mathematics',
    chapter: 'Fractions',
    chapterOrder: 1,
    lessonOrder: 2,
    title: 'Adding & Subtracting Fractions',
    titleMr: 'अपूर्णांक बेरीज व वजाबाकी',
    titleHi: 'भिन्न जोड़ और घटाव',
    duration: 18,
    xpReward: 60,
    difficulty: 'medium',
    concept: {
      text: `To **add or subtract fractions**, you need the **same denominator** (called a common denominator).\n\n**Same denominator?** Just add/subtract the numerators!\n  → 2/7 + 3/7 = **5/7**\n\n**Different denominators?** Find the LCM first!\n  → 1/2 + 1/3: LCM of 2 and 3 = 6\n  → 3/6 + 2/6 = **5/6**\n\nAlways simplify your answer if possible.`,
      textMr: `**अपूर्णांक बेरीज किंवा वजाबाकी** करण्यासाठी तुम्हाला **समान हर** (common denominator) आवश्यक आहे.\n\n**हर समान असल्यास?** फक्त अंश जोडा/वजा करा!\n  → २/७ + ३/७ = **५/७**\n\n**हर वेगळे असल्यास?** प्रथम लसावि (LCM) शोधा!\n  → १/२ + १/३: २ आणि ३ चे LCM = ६\n  → ३/६ + २/६ = **५/६**\n\nशक्य असल्यास उत्तर सरळ करा.`,
      textHi: `**भिन्न जोड़ने या घटाने** के लिए आपको **समान हर** चाहिए।\n\n**हर समान है?** बस अंश जोड़ें/घटाएं!\n  → २/७ + ३/७ = **५/७**\n\n**हर अलग हैं?** पहले LCM निकालें!\n  → १/२ + १/३: २ और ३ का LCM = ६\n  → ३/६ + २/६ = **५/६**\n\nहो सके तो उत्तर को सरल करें।`,
      simplifiedText: `🍰 Imagine cutting cakes into equal slices:\n• Same size slices → just count them together!\n• Different size slices → cut them to the same size first, then count\n\nSame denominator = same size slices → easy add!\nDifferent denominators → make them same first!`,
      simplifiedTextMr: `🍰 केक समान तुकड्यांत कापण्याची कल्पना करा:\n• समान आकाराचे तुकडे → फक्त एकत्र मोजा!\n• वेगळ्या आकाराचे तुकडे → प्रथम समान आकारात कापा, मग मोजा\n\nसमान हर = समान आकाराचे तुकडे → सोपी बेरीज!\nवेगळे हर → प्रथम समान करा!`,
      steps: [
        {
          step: 1,
          title: 'Check the denominators',
          titleMr: 'हर तपासा',
          text: 'Are the denominators the same? If yes → go to Step 3. If no → continue to Step 2.',
          textMr: 'हर समान आहेत का? होय असल्यास → चरण ३ वर जा. नाही → चरण २ वर जा.',
        },
        {
          step: 2,
          title: 'Find the LCM (Common Denominator)',
          titleMr: 'LCM शोधा (समान हर)',
          text: 'Find the Least Common Multiple of both denominators. Convert both fractions to have this new denominator.',
          textMr: 'दोन्ही हरांचे लघुत्तम साधारण अपवर्त्य (LCM) शोधा. दोन्ही अपूर्णांक या नव्या हरात बदला.',
        },
        {
          step: 3,
          title: 'Add or Subtract the Numerators',
          titleMr: 'अंश जोडा किंवा वजा करा',
          text: 'Keep the denominator the same. Only add or subtract the top numbers (numerators).',
          textMr: 'हर तसाच ठेवा. फक्त वरचे अंक (अंश) जोडा किंवा वजा करा.',
        },
        {
          step: 4,
          title: 'Simplify if possible',
          titleMr: 'शक्य असल्यास सरळ करा',
          text: 'If the numerator and denominator share a common factor, divide both by it to simplify.',
          textMr: 'अंश आणि हर यांचा समान घटक असल्यास, दोन्हींला त्याने भागा.',
        },
      ],
    },
    practice: {
      questions: [
        {
          id: 'q1',
          question: 'What is 2/9 + 4/9?',
          questionMr: '२/९ + ४/९ = ?',
          options: ['6/18', '6/9', '8/9', '2/3'],
          answer: 1,
          explanation: 'Same denominator (9), so just add numerators: 2 + 4 = 6. Answer: 6/9.',
          explanationMr: 'हर समान (९) आहे, म्हणून फक्त अंश जोडा: २ + ४ = ६. उत्तर: ६/९.',
        },
        {
          id: 'q2',
          question: 'What is 5/8 − 2/8?',
          questionMr: '५/८ − २/८ = ?',
          options: ['3/8', '7/8', '3/0', '7/16'],
          answer: 0,
          explanation: 'Same denominator (8), subtract numerators: 5 − 2 = 3. Answer: 3/8.',
          explanationMr: 'हर समान (८), अंश वजा करा: ५ − २ = ३. उत्तर: ३/८.',
        },
        {
          id: 'q3',
          question: 'What is 1/2 + 1/4?',
          questionMr: '१/२ + १/४ = ?',
          options: ['2/6', '2/8', '3/4', '1/3'],
          answer: 2,
          explanation: 'LCM of 2 and 4 is 4. Convert: 1/2 = 2/4. Now: 2/4 + 1/4 = 3/4.',
          explanationMr: '२ आणि ४ चे LCM = ४. बदला: १/२ = २/४. आता: २/४ + १/४ = ३/४.',
        },
        {
          id: 'q4',
          question: 'What is 3/4 − 1/2?',
          questionMr: '३/४ − १/२ = ?',
          options: ['2/2', '1/4', '1/2', '2/4'],
          answer: 1,
          explanation: 'LCM of 4 and 2 is 4. Convert: 1/2 = 2/4. Now: 3/4 − 2/4 = 1/4.',
          explanationMr: '४ आणि २ चे LCM = ४. बदला: १/२ = २/४. आता: ३/४ − २/४ = १/४.',
        },
        {
          id: 'q5',
          question: 'Riya ate 1/3 of a cake and Raj ate 1/6. How much did they eat together?',
          questionMr: 'रिया केकचा १/३ भाग खाल्ला आणि राज १/६ भाग. त्यांनी मिळून केकचा किती भाग खाल्ला?',
          options: ['2/9', '1/2', '3/6', '1/3'],
          answer: 1,
          explanation: 'LCM of 3 and 6 is 6. 1/3 = 2/6. So: 2/6 + 1/6 = 3/6 = 1/2.',
          explanationMr: '३ आणि ६ चे LCM = ६. १/३ = २/६. तर: २/६ + १/६ = ३/६ = १/२.',
        },
        {
          id: 'q6',
          question: 'Which is the simplified form of 6/8?',
          questionMr: '६/८ चे सरलीकृत रूप कोणते आहे?',
          options: ['3/4', '2/4', '6/8', '1/2'],
          answer: 0,
          explanation: 'GCD of 6 and 8 is 2. Divide both by 2: 6÷2 = 3, 8÷2 = 4. Simplified = 3/4.',
          explanationMr: '६ आणि ८ चा GCD = २. दोन्हींना २ ने भागा: ६÷२ = ३, ८÷२ = ४. सरलीकृत = ३/४.',
        },
      ],
    },
    revision: {
      points: [
        'Same denominators → just add/subtract numerators',
        'Different denominators → find LCM first, then convert',
        'Denominator never changes when adding/subtracting',
        'Always simplify by dividing numerator & denominator by their GCD',
      ],
      pointsMr: [
        'समान हर → फक्त अंश जोडा/वजा करा',
        'वेगळे हर → प्रथम LCM शोधा, मग बदला',
        'बेरीज/वजाबाकीत हर कधीच बदलत नाही',
        'उत्तर GCD ने भागून सरळ करा',
      ],
    },
  },

  // ══════════════════════════════════════
  // MATHEMATICS — Chapter: Algebra
  // ══════════════════════════════════════
  {
    id: 'math-algebra-1',
    subject: 'Mathematics',
    chapter: 'Basic Algebra',
    chapterOrder: 2,
    lessonOrder: 1,
    title: 'Introduction to Variables',
    titleMr: 'चल (Variable) ओळख',
    titleHi: 'चर (Variable) परिचय',
    duration: 15,
    xpReward: 55,
    difficulty: 'medium',
    concept: {
      text: `A **variable** is a letter (like x, y, or n) that represents an unknown number.\n\nAn **expression** combines variables and numbers: e.g., **2x + 5**\nAn **equation** says two things are equal: e.g., **2x + 5 = 11**\n\nTo **solve an equation**, find the value of the variable:\n  2x + 5 = 11\n  2x = 11 − 5 = 6\n  x = 6 ÷ 2 = **3**`,
      textMr: `**चल** म्हणजे एखादे अक्षर (जसे x, y, किंवा n) जे अज्ञात संख्या दर्शवते.\n\n**व्यंजन** (expression) मध्ये चल आणि संख्या एकत्र येतात: उदा., **2x + 5**\n**समीकरण** (equation) दोन गोष्टी समान असल्याचे सांगते: उदा., **2x + 5 = 11**\n\nसमीकरण **सोडवण्यासाठी**, चलाचे मूल्य शोधा:\n  2x + 5 = 11\n  2x = 11 − 5 = 6\n  x = 6 ÷ 2 = **3**`,
      textHi: `**चर** एक अक्षर है (जैसे x, y, या n) जो अज्ञात संख्या को दर्शाता है।\n\n**व्यंजक** में चर और संख्याएं मिलती हैं: उदा., **2x + 5**\n**समीकरण** दो चीज़ें बराबर होने की बात करता है: उदा., **2x + 5 = 11**\n\nसमीकरण **हल करने के लिए**, चर का मान खोजें:\n  2x + 5 = 11\n  2x = 11 − 5 = 6\n  x = 6 ÷ 2 = **3**`,
      simplifiedText: `🎁 Think of x as a mystery box.\n"2 boxes + 5 = 11" → How many are in each box?\n\nStep back: Remove the 5 from both sides → 2 boxes = 6\nSplit equally: Each box = 3\n\nSo x = 3! Algebra is just reverse detective work.`,
      simplifiedTextMr: `🎁 x ला एक रहस्यमय पेटी समजा.\n"२ पेट्या + ५ = ११" → प्रत्येक पेटीत किती आहे?\n\nमागे जा: दोन्ही बाजूंतून ५ काढा → २ पेट्या = ६\nसमान विभाजन: प्रत्येक पेटी = ३\n\nम्हणून x = ३! बीजगणित म्हणजे उलट गुप्तहेर काम.`,
      steps: [
        { step: 1, title: 'Identify the variable', titleMr: 'चल ओळखा', text: 'Find the unknown (x, y, n) you need to solve for.', textMr: 'तुम्हाला कोणते अज्ञात (x, y, n) सोडवायचे आहे ते शोधा.' },
        { step: 2, title: 'Move constants to one side', titleMr: 'स्थिरांक एका बाजूला न्या', text: 'Add or subtract the same number on both sides to move numbers away from the variable.', textMr: 'चलापासून संख्या दूर करण्यासाठी दोन्ही बाजूंना समान संख्या जोडा किंवा वजा करा.' },
        { step: 3, title: 'Isolate the variable', titleMr: 'चल एकटे सोडा', text: 'Divide or multiply both sides to get the variable alone on one side.', textMr: 'चल एका बाजूला एकटे मिळवण्यासाठी दोन्ही बाजूंना भागा किंवा गुणा.' },
        { step: 4, title: 'Check your answer', titleMr: 'उत्तर तपासा', text: 'Substitute the value back into the original equation to verify it works.', textMr: 'मूळ समीकरणात मूल्य घालून उत्तर बरोबर आहे का ते तपासा.' },
      ],
    },
    practice: {
      questions: [
        { id: 'q1', question: 'What does a variable represent?', questionMr: 'चल कशाचे प्रतिनिधित्व करतो?', options: ['A fixed number', 'An unknown number', 'A letter only', 'A fraction'], answer: 1, explanation: 'A variable (like x) represents an unknown number that we need to find.', explanationMr: 'चल (जसे x) एक अज्ञात संख्या दर्शवतो जी आपल्याला शोधायची आहे.' },
        { id: 'q2', question: 'Solve: x + 7 = 15', questionMr: 'सोडवा: x + 7 = 15', options: ['x = 7', 'x = 8', 'x = 22', 'x = 6'], answer: 1, explanation: 'x = 15 − 7 = 8. Check: 8 + 7 = 15 ✓', explanationMr: 'x = 15 − 7 = 8. तपासा: 8 + 7 = 15 ✓' },
        { id: 'q3', question: 'Solve: 3x = 18', questionMr: 'सोडवा: 3x = 18', options: ['x = 3', 'x = 54', 'x = 6', 'x = 15'], answer: 2, explanation: 'x = 18 ÷ 3 = 6. Check: 3×6 = 18 ✓', explanationMr: 'x = 18 ÷ 3 = 6. तपासा: 3×6 = 18 ✓' },
        { id: 'q4', question: 'Solve: 2x − 3 = 9', questionMr: 'सोडवा: 2x − 3 = 9', options: ['x = 3', 'x = 6', 'x = 4', 'x = 12'], answer: 1, explanation: '2x = 9 + 3 = 12; x = 12 ÷ 2 = 6. Check: 2(6) − 3 = 9 ✓', explanationMr: '2x = 9 + 3 = 12; x = 12 ÷ 2 = 6. तपासा: 2(6) − 3 = 9 ✓' },
        { id: 'q5', question: 'If n/4 = 5, what is n?', questionMr: 'जर n/4 = 5, तर n = ?', options: ['1.25', '9', '20', '1'], answer: 2, explanation: 'n = 5 × 4 = 20. Check: 20/4 = 5 ✓', explanationMr: 'n = 5 × 4 = 20. तपासा: 20/4 = 5 ✓' },
        { id: 'q6', question: 'Which is an equation (not just an expression)?', questionMr: 'खालीलपैकी कोणते समीकरण आहे (फक्त व्यंजन नव्हे)?', options: ['3x + 2', 'y − 7', '4n + 1 = 13', '5m'], answer: 2, explanation: 'An equation has an equals sign (=). Only "4n + 1 = 13" has an equals sign.', explanationMr: 'समीकरणात समान चिन्ह (=) असते. फक्त "4n + 1 = 13" मध्ये समान चिन्ह आहे.' },
      ],
    },
    revision: {
      points: [
        'Variable = letter representing an unknown number',
        'Expression = variables + numbers (no equals sign)',
        'Equation = expression = expression (has = sign)',
        'To solve: isolate the variable using inverse operations',
        'Always check: substitute answer back into equation',
      ],
      pointsMr: [
        'चल = अज्ञात संख्या दर्शवणारे अक्षर',
        'व्यंजन = चल + संख्या (समान चिन्ह नाही)',
        'समीकरण = व्यंजन = व्यंजन (= चिन्ह आहे)',
        'सोडवणे: व्यस्त क्रिया वापरून चल एकटे करा',
        'नेहमी तपासा: उत्तर समीकरणात घाला',
      ],
    },
  },

  // ══════════════════════════════════════
  // SCIENCE — Chapter: Forces & Motion
  // ══════════════════════════════════════
  {
    id: 'science-forces-1',
    subject: 'Science',
    chapter: 'Forces & Motion',
    chapterOrder: 1,
    lessonOrder: 1,
    title: 'What Is Force?',
    titleMr: 'बल म्हणजे काय?',
    titleHi: 'बल क्या है?',
    duration: 15,
    xpReward: 50,
    difficulty: 'easy',
    concept: {
      text: `A **force** is a push or pull on an object that can change its:\n• **Speed** — make it faster or slower\n• **Direction** — change where it moves\n• **Shape** — squeeze or stretch it\n\nForce is measured in **Newtons (N)**.\n\nTypes of forces:\n• **Gravity** — pulls everything down toward Earth\n• **Friction** — resists motion between surfaces\n• **Magnetic force** — between magnets or metals\n• **Applied force** — a push/pull you apply directly`,
      textMr: `**बल** म्हणजे एखाद्या वस्तूवर ढकलणे किंवा ओढणे, जे बदलू शकते:\n• **वेग** — वेगवान किंवा हळू करणे\n• **दिशा** — कुठे जाते ते बदलणे\n• **आकार** — दाबणे किंवा ताणणे\n\nबल **न्यूटन (N)** मध्ये मोजले जाते.\n\nबलाचे प्रकार:\n• **गुरुत्वाकर्षण** — सर्व काही पृथ्वीकडे ओढते\n• **घर्षण** — पृष्ठभागांमध्ये गतीला विरोध करते\n• **चुंबकीय बल** — चुंबक किंवा धातूंमध्ये\n• **लागू बल** — तुम्ही थेट लागू केलेले ढकलणे/ओढणे`,
      textHi: `**बल** किसी वस्तु पर धक्का या खिंचाव है, जो बदल सकता है:\n• **गति** — तेज़ या धीमी करना\n• **दिशा** — कहाँ जाती है बदलना\n• **आकार** — दबाना या खींचना\n\nबल **न्यूटन (N)** में मापा जाता है।\n\nबल के प्रकार:\n• **गुरुत्वाकर्षण** — सब कुछ पृथ्वी की ओर खींचता है\n• **घर्षण** — सतहों के बीच गति का विरोध करता है\n• **चुंबकीय बल** — चुंबक या धातुओं के बीच\n• **लागू बल** — आप जो सीधे लगाते हैं`,
      simplifiedText: `🤜 Push a book — that's a force! 🧲 Magnet pulls a pin — that's a force!\n\nForce = any push or pull\n• Can start, stop, or change movement\n• Can change shape (squish clay!)\n• Measured in Newtons — named after Isaac Newton\n\nGravity is why you don't float away right now! 🌍`,
      simplifiedTextMr: `🤜 पुस्तक ढकलणे — हे बल आहे! 🧲 चुंबक पिन ओढते — हे बल आहे!\n\nबल = कोणतेही ढकलणे किंवा ओढणे\n• हालचाल सुरू, थांबवू किंवा बदलू शकते\n• आकार बदलू शकते (माती दाबा!)\n• न्यूटनमध्ये मोजतात — आयझॅक न्यूटन यांच्या नावावरून\n\nगुरुत्वाकर्षण म्हणून तुम्ही आत्ता हवेत तरंगत नाही! 🌍`,
      steps: [
        { step: 1, title: 'Identify the object', titleMr: 'वस्तू ओळखा', text: 'Find the object on which the force acts.', textMr: 'ज्या वस्तूवर बल कार्य करते ती ओळखा.' },
        { step: 2, title: 'Identify the force type', titleMr: 'बलाचा प्रकार ओळखा', text: 'Is it gravity, friction, magnetic, or applied force?', textMr: 'गुरुत्वाकर्षण, घर्षण, चुंबकीय, किंवा लागू बल आहे का?' },
        { step: 3, title: 'Find the direction', titleMr: 'दिशा शोधा', text: 'Forces have direction. Gravity pulls DOWN. Friction acts AGAINST motion.', textMr: 'बलाला दिशा असते. गुरुत्वाकर्षण खाली ओढते. घर्षण गतीच्या विरुद्ध कार्य करते.' },
        { step: 4, title: 'Determine the effect', titleMr: 'परिणाम ठरवा', text: 'What does the force do? Does it speed up, slow down, stop, or change direction?', textMr: 'बलाचा काय परिणाम होतो? वेग वाढतो, कमी होतो, थांबतो, किंवा दिशा बदलते?' },
      ],
    },
    practice: {
      questions: [
        { id: 'q1', question: 'Which of these is an example of a "pull" force?', questionMr: 'यापैकी कोणते "ओढण्याचे" बलाचे उदाहरण आहे?', options: ['Pushing a door open', 'Kicking a ball', 'A magnet attracting iron', 'Blowing air on paper'], answer: 2, explanation: 'A magnet attracting iron is a pull — it draws the iron toward itself.', explanationMr: 'चुंबक लोह ओढणे हे ओढण्याचे बल आहे — ते लोहाला स्वतःकडे आकर्षित करते.' },
        { id: 'q2', question: 'What unit is force measured in?', questionMr: 'बल कोणत्या एककात मोजतात?', options: ['Kilogram (kg)', 'Newton (N)', 'Meter (m)', 'Joule (J)'], answer: 1, explanation: 'Force is measured in Newtons (N), named after Sir Isaac Newton.', explanationMr: 'बल न्यूटन (N) मध्ये मोजतात, सर आयझॅक न्यूटन यांच्या नावावरून.' },
        { id: 'q3', question: 'Which force pulls objects toward the center of the Earth?', questionMr: 'कोणते बल वस्तूंना पृथ्वीच्या केंद्राकडे ओढते?', options: ['Friction', 'Magnetic force', 'Gravity', 'Applied force'], answer: 2, explanation: 'Gravity is the force that pulls all objects toward the center of the Earth.', explanationMr: 'गुरुत्वाकर्षण हे बल सर्व वस्तूंना पृथ्वीच्या केंद्राकडे ओढते.' },
        { id: 'q4', question: 'A sliding book slows down on a table. What force causes this?', questionMr: 'टेबलवर घसरणारे पुस्तक मंद होते. कोणते बल हे घडवते?', options: ['Gravity', 'Friction', 'Magnetic force', 'Air pressure'], answer: 1, explanation: 'Friction acts between the book and table surface, opposing the motion and slowing the book down.', explanationMr: 'पुस्तक आणि टेबलच्या पृष्ठभागामध्ये घर्षण कार्य करते, गतीला विरोध करते आणि पुस्तक मंद करते.' },
        { id: 'q5', question: 'Which of these does a force NOT change?', questionMr: 'खालीलपैकी बल कशात बदल करत नाही?', options: ['Speed of an object', 'Direction of movement', 'Color of an object', 'Shape of an object'], answer: 2, explanation: 'Force can change speed, direction, and shape — but not the color of an object!', explanationMr: 'बल वेग, दिशा आणि आकार बदलू शकते — परंतु वस्तूचा रंग नाही!' },
      ],
    },
    revision: {
      points: [
        'Force = push or pull on an object',
        'Forces can change speed, direction, or shape',
        'Measured in Newtons (N)',
        'Gravity pulls everything toward Earth',
        'Friction opposes motion between surfaces',
      ],
      pointsMr: [
        'बल = वस्तूवर ढकलणे किंवा ओढणे',
        'बल वेग, दिशा किंवा आकार बदलू शकते',
        'न्यूटन (N) मध्ये मोजतात',
        'गुरुत्वाकर्षण सर्व काही पृथ्वीकडे ओढते',
        'घर्षण पृष्ठभागांमध्ये गतीला विरोध करते',
      ],
    },
  },

  // ══════════════════════════════════════
  // SCIENCE — Chapter: Plants
  // ══════════════════════════════════════
  {
    id: 'science-plants-1',
    subject: 'Science',
    chapter: 'Plants & Photosynthesis',
    chapterOrder: 2,
    lessonOrder: 1,
    title: 'How Plants Make Food',
    titleMr: 'झाडे अन्न कसे बनवतात',
    titleHi: 'पौधे भोजन कैसे बनाते हैं',
    duration: 15,
    xpReward: 50,
    difficulty: 'easy',
    concept: {
      text: `Plants make their own food through a process called **photosynthesis**.\n\nThe formula:\n☀️ Sunlight + 💧 Water + 🌬️ Carbon dioxide → 🍬 Glucose + 💨 Oxygen\n\nWhere it happens: **Chloroplasts** (held in leaves, contain green **chlorophyll**)\n\n**Chlorophyll** is the green pigment that captures sunlight energy — it's also why leaves are green!`,
      textMr: `झाडे **प्रकाशसंश्लेषण** (photosynthesis) नावाच्या प्रक्रियेद्वारे स्वतःचे अन्न तयार करतात.\n\nसूत्र:\n☀️ सूर्यप्रकाश + 💧 पाणी + 🌬️ कार्बन डायऑक्साइड → 🍬 ग्लुकोज + 💨 ऑक्सिजन\n\nहे कुठे होते: **क्लोरोप्लास्ट** (पानांत असतात, हिरवे **क्लोरोफिल** असते)\n\n**क्लोरोफिल** हा हिरवा रंगद्रव्य आहे जो सूर्यप्रकाश ऊर्जा अडवतो — म्हणून पाने हिरवी असतात!`,
      textHi: `पौधे **प्रकाश संश्लेषण** (photosynthesis) नामक प्रक्रिया से अपना भोजन बनाते हैं।\n\nसूत्र:\n☀️ सूर्यप्रकाश + 💧 पानी + 🌬️ कार्बन डाइऑक्साइड → 🍬 ग्लूकोज + 💨 ऑक्सीजन\n\nयह कहाँ होता है: **क्लोरोप्लास्ट** (पत्तियों में, हरे **क्लोरोफिल** के साथ)\n\n**क्लोरोफिल** हरा रंगद्रव्य है जो सूर्य ऊर्जा को पकड़ता है — इसीलिए पत्तियाँ हरी होती हैं!`,
      simplifiedText: `🏭 Think of a leaf as a tiny food factory:\n• Raw materials: Sunlight (energy), Water (from roots), CO₂ (from air)\n• Product: Glucose (plant's food + our food!) + Oxygen (the air we breathe!)\n\nNo sun = No photosynthesis = Plant dies 🌿\nPhotosynthesis also gives us the oxygen we breathe!`,
      simplifiedTextMr: `🏭 पान हे एक लहान अन्न कारखाना आहे असे समजा:\n• कच्चा माल: सूर्यप्रकाश (ऊर्जा), पाणी (मुळांतून), CO₂ (हवेतून)\n• उत्पादन: ग्लुकोज (झाडाचे अन्न + आपले अन्न!) + ऑक्सिजन (आपण श्वास घेतो!)\n\nसूर्य नसेल = प्रकाशसंश्लेषण नाही = झाड मरते 🌿\nप्रकाशसंश्लेषण आपण श्वास घेतो तो ऑक्सिजनही देते!`,
      steps: [
        { step: 1, title: 'Sunlight hits the leaf', titleMr: 'सूर्यप्रकाश पानावर पडतो', text: 'Chlorophyll in the leaf absorbs sunlight energy. Leaves are broad and flat to capture maximum sunlight.', textMr: 'पानातील क्लोरोफिल सूर्यप्रकाश ऊर्जा अडवतो. जास्तीत जास्त सूर्यप्रकाश मिळवण्यासाठी पाने रुंद आणि सपाट असतात.' },
        { step: 2, title: 'Water travels up', titleMr: 'पाणी वर येते', text: 'Roots absorb water from the soil. It travels up through the stem to the leaves via xylem vessels.', textMr: 'मुळे जमिनीतून पाणी शोषतात. ते xylem वाहिन्यांद्वारे स्तंभातून पानांपर्यंत जाते.' },
        { step: 3, title: 'CO₂ enters through stomata', titleMr: 'CO₂ रंध्रांद्वारे आत येतो', text: 'Carbon dioxide from the air enters the leaf through tiny pores called stomata (usually on the underside).', textMr: 'हवेतील कार्बन डायऑक्साइड रंध्र (stomata) नावाच्या लहान छिद्रांद्वारे पानात शिरतो.' },
        { step: 4, title: 'Glucose and Oxygen produced', titleMr: 'ग्लुकोज आणि ऑक्सिजन तयार होतो', text: 'Using sunlight energy, water and CO₂ combine to form glucose (food) and oxygen (released into air).', textMr: 'सूर्यप्रकाश ऊर्जा वापरून, पाणी आणि CO₂ एकत्र येऊन ग्लुकोज (अन्न) आणि ऑक्सिजन (हवेत सोडला जातो) तयार होतो.' },
      ],
    },
    practice: {
      questions: [
        { id: 'q1', question: 'What are the raw materials for photosynthesis?', questionMr: 'प्रकाशसंश्लेषणासाठी कच्चे पदार्थ कोणते आहेत?', options: ['Glucose and Oxygen', 'Sunlight, Water, CO₂', 'Chlorophyll and Water', 'CO₂ and Glucose'], answer: 1, explanation: 'Photosynthesis requires Sunlight (energy), Water (from soil), and Carbon dioxide (from air).', explanationMr: 'प्रकाशसंश्लेषणासाठी सूर्यप्रकाश, पाणी (मातीतून) आणि कार्बन डायऑक्साइड (हवेतून) आवश्यक आहे.' },
        { id: 'q2', question: 'Where does photosynthesis mainly occur?', questionMr: 'प्रकाशसंश्लेषण मुख्यतः कुठे होते?', options: ['Roots', 'Stem', 'Leaves', 'Flowers'], answer: 2, explanation: 'Photosynthesis mainly occurs in leaves, where chloroplasts (containing chlorophyll) are most abundant.', explanationMr: 'प्रकाशसंश्लेषण मुख्यतः पानांमध्ये होते, जिथे क्लोरोप्लास्ट (क्लोरोफिल असलेले) सर्वाधिक असतात.' },
        { id: 'q3', question: 'What gas is released by plants during photosynthesis?', questionMr: 'प्रकाशसंश्लेषणात झाडे कोणता वायू सोडतात?', options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], answer: 2, explanation: 'Plants release Oxygen as a by-product of photosynthesis — which we breathe!', explanationMr: 'झाडे प्रकाशसंश्लेषणात ऑक्सिजन उप-उत्पाद म्हणून सोडतात — जो आपण श्वास घेतो!' },
        { id: 'q4', question: 'What is chlorophyll?', questionMr: 'क्लोरोफिल म्हणजे काय?', options: ['The root of a plant', 'The green pigment that absorbs sunlight', 'The sugar made by plants', 'The pores on leaves'], answer: 1, explanation: 'Chlorophyll is the green pigment in chloroplasts that captures sunlight energy for photosynthesis.', explanationMr: 'क्लोरोफिल हे क्लोरोप्लास्टमधील हिरवे रंगद्रव्य आहे जे प्रकाशसंश्लेषणासाठी सूर्यप्रकाश ऊर्जा अडवते.' },
        { id: 'q5', question: 'A plant is kept in a dark room for a week. What happens?', questionMr: 'एक आठवड्यासाठी झाड अंधाऱ्या खोलीत ठेवल्यास काय होईल?', options: ['It grows faster', 'It makes more glucose', 'It cannot photosynthesize and may die', 'Nothing changes'], answer: 2, explanation: 'Without sunlight, photosynthesis cannot occur. The plant cannot make food and will eventually die.', explanationMr: 'सूर्यप्रकाशाशिवाय प्रकाशसंश्लेषण होऊ शकत नाही. झाड अन्न बनवू शकत नाही आणि शेवटी मरते.' },
      ],
    },
    revision: {
      points: [
        'Photosynthesis = plants making food using sunlight',
        'Inputs: Sunlight + Water + CO₂ → Outputs: Glucose + Oxygen',
        'Occurs in chloroplasts inside leaf cells',
        'Chlorophyll (green pigment) captures sunlight',
        'Stomata are tiny pores for gas exchange',
      ],
      pointsMr: [
        'प्रकाशसंश्लेषण = सूर्यप्रकाश वापरून झाडे अन्न बनवतात',
        'प्रवेश: सूर्यप्रकाश + पाणी + CO₂ → बाहेर: ग्लुकोज + ऑक्सिजन',
        'पेशींमधील क्लोरोप्लास्टमध्ये होते',
        'क्लोरोफिल (हिरवे रंगद्रव्य) सूर्यप्रकाश अडवते',
        'रंध्र (stomata) वायू आदान-प्रदानासाठी लहान छिद्रे आहेत',
      ],
    },
  },

  // ══════════════════════════════════════
  // ENGLISH — Chapter: Grammar
  // ══════════════════════════════════════
  {
    id: 'english-grammar-1',
    subject: 'English',
    chapter: 'Parts of Speech',
    chapterOrder: 1,
    lessonOrder: 1,
    title: 'Nouns, Verbs & Adjectives',
    titleMr: 'नाम, क्रियापद आणि विशेषण',
    titleHi: 'संज्ञा, क्रिया और विशेषण',
    duration: 15,
    xpReward: 45,
    difficulty: 'easy',
    concept: {
      text: `**Parts of speech** are the building blocks of English grammar.\n\n**Noun** — names a person, place, thing, or idea\n  Examples: *dog, school, happiness, Priya*\n\n**Verb** — shows action or state of being\n  Examples: *run, eat, is, think*\n\n**Adjective** — describes a noun\n  Examples: *tall, red, happy, three*\n\nSentence example: "The **happy** (adj) **child** (noun) **runs** (verb) fast."`,
      textMr: `**भाषणाचे भाग** (parts of speech) हे इंग्रजी व्याकरणाचे मूलभूत घटक आहेत.\n\n**नाम** (Noun) — व्यक्ती, स्थान, वस्तू किंवा कल्पनेचे नाव\n  उदाहरणे: *कुत्रा, शाळा, आनंद, प्रिया*\n\n**क्रियापद** (Verb) — क्रिया किंवा अस्तित्व दर्शवते\n  उदाहरणे: *धावणे, खाणे, आहे, विचार करणे*\n\n**विशेषण** (Adjective) — नामाचे वर्णन करते\n  उदाहरणे: *उंच, लाल, आनंदी, तीन*\n\nवाक्य उदाहरण: "**आनंदी** (विशेषण) **मुलगा** (नाम) **धावतो** (क्रियापद)."`,
      textHi: `**भाषण के भाग** (parts of speech) अंग्रेज़ी व्याकरण के मूल घटक हैं।\n\n**संज्ञा** (Noun) — व्यक्ति, स्थान, वस्तु या विचार का नाम\n  उदाहरण: *कुत्ता, स्कूल, खुशी, प्रिया*\n\n**क्रिया** (Verb) — क्रिया या अस्तित्व दर्शाती है\n  उदाहरण: *दौड़ना, खाना, है, सोचना*\n\n**विशेषण** (Adjective) — संज्ञा का वर्णन करता है\n  उदाहरण: *लंबा, लाल, खुश, तीन*\n\nवाक्य: "**खुश** (विशेषण) **बच्चा** (संज्ञा) **दौड़ता** (क्रिया) है।"`,
      simplifiedText: `🏷️ **Noun** = Name of something: Dog, City, Love\n⚡ **Verb** = What something DOES: Runs, Eats, Sleeps\n🌈 **Adjective** = What something LOOKS/FEELS like: Big, Blue, Angry\n\nTrick: Find the verb first → then ask "Who/What did it?" → that's the noun → "What kind?" → that's the adjective!`,
      simplifiedTextMr: `🏷️ **नाम** = कशाचे तरी नाव: कुत्रा, शहर, प्रेम\n⚡ **क्रियापद** = ते काय करते: धावतो, खातो, झोपतो\n🌈 **विशेषण** = ते कसे दिसते/वाटते: मोठे, निळे, रागावलेले\n\nयुक्ती: प्रथम क्रियापद शोधा → मग विचारा "कोणी/काय केले?" → ते नाम आहे → "कसे?" → ते विशेषण आहे!`,
      steps: [
        { step: 1, title: 'Find the verb', titleMr: 'क्रियापद शोधा', text: 'Ask "What is happening?" in the sentence. That word is the verb.', textMr: 'वाक्यात "काय होत आहे?" असे विचारा. ते शब्द क्रियापद आहे.' },
        { step: 2, title: 'Find the noun', titleMr: 'नाम शोधा', text: 'Ask "Who or what is doing the verb?" That gives you the noun (subject).', textMr: '"कोण किंवा काय क्रियापद करत आहे?" असे विचारा. ते नाम (कर्ता) देते.' },
        { step: 3, title: 'Find the adjective', titleMr: 'विशेषण शोधा', text: 'Ask "What kind of noun is it?" or "How many?" or "Which one?" — the answer is an adjective.', textMr: '"नाम कसे आहे?" किंवा "किती?" किंवा "कोणते?" असे विचारा — उत्तर विशेषण आहे.' },
        { step: 4, title: 'Practice with sentences', titleMr: 'वाक्यांसह सराव करा', text: 'Take any sentence and label each word as noun, verb, or adjective to practice.', textMr: 'कोणतेही वाक्य घ्या आणि प्रत्येक शब्दाला नाम, क्रियापद किंवा विशेषण म्हणून लेबल करा.' },
      ],
    },
    practice: {
      questions: [
        { id: 'q1', question: 'Identify the NOUN: "The playful puppy chased a ball."', questionMr: '"The playful puppy chased a ball." — नाम ओळखा', options: ['playful', 'chased', 'puppy', 'a'], answer: 2, explanation: '"Puppy" is the noun — it names an animal (thing/person/creature). "Ball" is also a noun, but puppy is the main subject here.', explanationMr: '"Puppy" हे नाम आहे — ते एका प्राण्याचे नाव आहे. "Ball" सुद्धा एक नाम आहे.' },
        { id: 'q2', question: 'Identify the VERB: "She quickly solved the problem."', questionMr: '"She quickly solved the problem." — क्रियापद ओळखा', options: ['She', 'quickly', 'solved', 'problem'], answer: 2, explanation: '"Solved" is the verb — it shows the action performed (solving). "Quickly" is an adverb (describes how).', explanationMr: '"Solved" हे क्रियापद आहे — ते केलेली क्रिया दर्शवते. "Quickly" हे क्रियाविशेषण आहे.' },
        { id: 'q3', question: 'Identify the ADJECTIVE: "The tall boy won a golden trophy."', questionMr: '"The tall boy won a golden trophy." — विशेषण ओळखा', options: ['won', 'boy', 'tall', 'trophy'], answer: 2, explanation: '"Tall" describes the noun "boy" — it is an adjective. "Golden" also describes "trophy."', explanationMr: '"Tall" नामाचे "boy" वर्णन करते — ते विशेषण आहे. "Golden" सुद्धा "trophy" चे वर्णन करते.' },
        { id: 'q4', question: 'Which sentence uses a noun, verb, AND adjective?', questionMr: 'कोणत्या वाक्यात नाम, क्रियापद आणि विशेषण तिन्ही आहेत?', options: ['She runs.', 'Fast!', 'The brave soldier fought.', 'Running is good.'], answer: 2, explanation: '"The brave (adj) soldier (noun) fought (verb)" has all three parts of speech.', explanationMr: '"The brave (विशेषण) soldier (नाम) fought (क्रियापद)" — तिन्ही भाषणाचे भाग आहेत.' },
        { id: 'q5', question: 'In "Beautiful flowers bloom in spring" — what is "Beautiful"?', questionMr: '"Beautiful flowers bloom in spring" — "Beautiful" काय आहे?', options: ['Noun', 'Verb', 'Adjective', 'Adverb'], answer: 2, explanation: '"Beautiful" describes the noun "flowers" — answering "What kind of flowers?" — so it is an adjective.', explanationMr: '"Beautiful" नाम "flowers" चे वर्णन करते — "कसली फुले?" — म्हणून ते विशेषण आहे.' },
        { id: 'q6', question: 'Which is a VERB?', questionMr: 'खालीलपैकी क्रियापद कोणते आहे?', options: ['Mountain', 'Quickly', 'Dance', 'Happy'], answer: 2, explanation: '"Dance" shows an action — making it a verb. "Mountain" is a noun, "Quickly" is an adverb, "Happy" is an adjective.', explanationMr: '"Dance" एक क्रिया दर्शवते — म्हणून ते क्रियापद आहे.' },
      ],
    },
    revision: {
      points: [
        'Noun = name of person, place, thing, or idea',
        'Verb = action word or state of being',
        'Adjective = word that describes a noun',
        'Trick: Verb first → Who/What? (noun) → What kind? (adjective)',
      ],
      pointsMr: [
        'नाम = व्यक्ती, स्थान, वस्तू किंवा कल्पनेचे नाव',
        'क्रियापद = क्रिया दर्शवणारे शब्द',
        'विशेषण = नामाचे वर्णन करणारा शब्द',
        'युक्ती: प्रथम क्रियापद → कोण/काय? (नाम) → कसे? (विशेषण)',
      ],
    },
  },
];

// Helper: get chapters for a subject
export function getChapters(subject) {
  const subjectLessons = LESSONS.filter((l) => l.subject === subject);
  const chapters = {};
  subjectLessons.forEach((l) => {
    if (!chapters[l.chapter]) chapters[l.chapter] = [];
    chapters[l.chapter].push(l);
  });
  return Object.entries(chapters).map(([name, lessons]) => ({
    name,
    lessons: lessons.sort((a, b) => a.lessonOrder - b.lessonOrder),
  }));
}

// Helper: get lesson by id
export function getLessonById(id) {
  return LESSONS.find((l) => l.id === id) || null;
}

// Helper: get daily recommended lesson (rotates by day + weak subjects)
export function getDailyLesson(completedIds = [], weakSubjects = []) {
  const today = new Date().toDateString();
  const available = LESSONS.filter((l) => !completedIds.includes(l.id));
  if (available.length === 0) return LESSONS[0]; // all done, cycle back

  // Prefer weak subject lessons
  const weakFirst = available.filter((l) => weakSubjects.includes(l.subject));
  const pool = weakFirst.length > 0 ? weakFirst : available;

  // Deterministic daily pick based on day-of-year
  const dayNum = Math.floor(Date.now() / 86400000);
  return pool[dayNum % pool.length];
}
