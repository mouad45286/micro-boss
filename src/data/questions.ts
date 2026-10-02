import { Question } from '../../shared/types';

export const QUESTIONS_BY_WORLD: Record<number, Question[]> = {
  // WORLD 1: CIRCUIT CITY (Easy / Introductory — Friendly Timers & Visual Hints)
  1: [
    {
      id: 'w1-q1',
      difficulty: 'easy',
      category: 'buttons',
      titleEn: 'What does `button_a.is_pressed()` return when you press and hold Button A?',
      titleAr: 'ماذا تُرجع الدالة `button_a.is_pressed()` عندما تضغط وتستمر بالضغط على الزر A؟',
      hintEn: '💡 Hint: It answers a Yes/No question in Python (a Boolean value)!',
      hintAr: '💡 تلميح: تُرجع إجابة بنعم أو لا بلغة بايثون (قيمة منطقية Boolean)!',
      codeSnippet: `from microbit import *

while True:
    if button_a.is_pressed():
        display.show(Image.HAPPY)`,
      options: [
        { textEn: 'True', textAr: 'القيمة True' },
        { textEn: 'False', textAr: 'القيمة False' },
        { textEn: '100', textAr: 'العدد 100' },
        { textEn: '"PRESSED"', textAr: 'النص "PRESSED"' },
      ],
      correctOptionIndex: 0,
      explanationEn: '`button_a.is_pressed()` returns `True` while the button is physically held down, and `False` when released.',
      explanationAr: 'تُرجع الدالة `button_a.is_pressed()` القيمة `True` طالما أن الزر مضغوط، و `False` عند تركه.',
      timeLimitSec: 35,
      microbitDisplaySim: [
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
      ],
    },
    {
      id: 'w1-q2',
      difficulty: 'easy',
      category: 'display',
      titleEn: 'Which command displays the built-in happy face on the 5x5 LED screen?',
      titleAr: 'أي أمر يعرض الوجه المبتسم الجاهز على شاشة الـ 5x5 LED؟',
      hintEn: '💡 Hint: In MicroPython, images are shown using `display.show(...)`.',
      hintAr: '💡 تلميح: في مايكروبايثون، تُعرض الصور باستخدام الأمر `display.show(...)`.',
      codeSnippet: `from microbit import *

# Display a happy face
display.________(Image.HAPPY)`,
      options: [
        { textEn: 'display.show(Image.HAPPY)', textAr: 'display.show(Image.HAPPY)' },
        { textEn: 'display.draw("HAPPY")', textAr: 'display.draw("HAPPY")' },
        { textEn: 'screen.print(HAPPY)', textAr: 'screen.print(HAPPY)' },
        { textEn: 'led.turn_on(Image.HAPPY)', textAr: 'led.turn_on(Image.HAPPY)' },
      ],
      correctOptionIndex: 0,
      explanationEn: 'Use `display.show(Image.HAPPY)` to display any built-in picture icon on the 5x5 LED matrix.',
      explanationAr: 'نستخدم `display.show(Image.HAPPY)` لعرض أي صورة جاهزة من مكتبة الصور المدمجة على شاشة المايكروبت.',
      timeLimitSec: 32,
      microbitDisplaySim: [
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
      ],
    },
    {
      id: 'w1-q3',
      difficulty: 'easy',
      category: 'display',
      titleEn: 'Which function scrolls words smoothly across the screen like a marquee ticker?',
      titleAr: 'أي دالة تقوم بتمرير الكلمات بنعومة عبر الشاشة كشريط إخباري متحرك؟',
      hintEn: '💡 Hint: Think of "scrolling" text across the screen!',
      hintAr: '💡 تلميح: فكر في كلمة التمرير الإنجليزية "scroll"!',
      codeSnippet: `from microbit import *

# Scroll message across LEDs
display.________("HELLO ROBOT")`,
      options: [
        { textEn: 'display.scroll("HELLO ROBOT")', textAr: 'display.scroll("HELLO ROBOT")' },
        { textEn: 'display.print("HELLO ROBOT")', textAr: 'display.print("HELLO ROBOT")' },
        { textEn: 'display.write("HELLO ROBOT")', textAr: 'display.write("HELLO ROBOT")' },
        { textEn: 'display.push("HELLO ROBOT")', textAr: 'display.push("HELLO ROBOT")' },
      ],
      correctOptionIndex: 0,
      explanationEn: '`display.scroll()` scrolls long strings of text one character at a time across the 5x5 display.',
      explanationAr: 'تقوم الدالة `display.scroll()` بتمرير النصوص الطويلة حرفاً بحرف عبر شاشة الـ 5x5 LED.',
      timeLimitSec: 30,
    },
    {
      id: 'w1-q4',
      difficulty: 'easy',
      category: 'pins',
      titleEn: 'How do you send electricity to turn ON an external LED wired to Pin 0?',
      titleAr: 'كيف ترسل إشارة كهربائية لتشغيل مصباح LED خارجي موصول بالمنفذ Pin 0؟',
      hintEn: '💡 Hint: In digital computing, 1 means ON (High voltage) and 0 means OFF!',
      hintAr: '💡 تلميح: في الحوسبة الرقمية، الرقم 1 يعني تشغيل (جهد عالي) و 0 يعني إطفاء!',
      codeSnippet: `from microbit import *

# Turn on connected component
pin0.________(1)`,
      options: [
        { textEn: 'write_digital(1)', textAr: 'write_digital(1)' },
        { textEn: 'turn_on()', textAr: 'turn_on()' },
        { textEn: 'set_light(True)', textAr: 'set_light(True)' },
        { textEn: 'power_high()', textAr: 'power_high()' },
      ],
      correctOptionIndex: 0,
      explanationEn: '`pin0.write_digital(1)` outputs a 3.3V HIGH signal through Pin 0 to power an external LED or circuit.',
      explanationAr: 'الدالة `pin0.write_digital(1)` ترسل إشارة رقمية عالية 3.3 فولت عبر المنفذ Pin 0 لتشغيل المصباح أو الدائرة.',
      timeLimitSec: 30,
    },
    {
      id: 'w1-q5',
      difficulty: 'easy',
      category: 'code-challenge',
      titleEn: '⚡ WEAK POINT: Complete the button check to display a HEART!',
      titleAr: '⚡ نقطة ضعف الوحش: أكمل فحص الزر لعرض شكل القلب!',
      hintEn: '💡 Hint: Complete the line with `button_a.is_pressed():`',
      hintAr: '💡 تلميح: أكمل السطر بالعبارة: `button_a.is_pressed():`',
      isCodeEditorChallenge: true,
      codeEditorPromptEn: 'Type or complete the condition line to check if button_a is pressed:',
      codeEditorPromptAr: 'اكتب أو أكمل سطر الشرط للتحقق مما إذا كان الزر button_a مضغوطاً:',
      codeStarter: `from microbit import *

while True:
    if button_a.is_pressed():
        display.show(Image.HEART)`,
      expectedPattern: 'button_a\\.is_pressed\\(\\)',
      explanationEn: '`if button_a.is_pressed():` detects when the player physically holds Button A.',
      explanationAr: 'الشرط `if button_a.is_pressed():` يكتشف متى يضغط اللاعب على الزر الفيزيائي A.',
      timeLimitSec: 45,
      microbitDisplaySim: [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
      ],
    },
  ],

  // WORLD 2: SENSOR FACTORY (Medium — Sensors, Gestures, Compass, Temperature)
  2: [
    {
      id: 'w2-q1',
      difficulty: 'medium',
      category: 'sensors',
      titleEn: 'Which gesture string detects when someone shakes the micro:bit?',
      titleAr: 'ما هي الكلمة التي تعبر عن إيماءة هز لوحة المايكروبت؟',
      hintEn: '💡 Hint: The gesture is named after shaking movement!',
      hintAr: '💡 تلميح: اسم الإيماءة يعني كلمة "هز" بالإنجليزية!',
      codeSnippet: `from microbit import *

while True:
    if accelerometer.current_gesture() == "________":
        display.show(Image.SURPRISED)`,
      options: [
        { textEn: '"shake"', textAr: '"shake"' },
        { textEn: '"vibrate"', textAr: '"vibrate"' },
        { textEn: '"move"', textAr: '"move"' },
        { textEn: '"swing"', textAr: '"swing"' },
      ],
      correctOptionIndex: 0,
      explanationEn: 'MicroPython provides standard gesture names like "shake", "up", "down", "face up", and "freefall".',
      explanationAr: 'توفر مايكروبايثون إيماءات قياسية مثل "shake" و "up" و "down" و "face up" و "freefall".',
      timeLimitSec: 28,
      microbitDisplaySim: [
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
      ],
    },
    {
      id: 'w2-q2',
      difficulty: 'medium',
      category: 'sensors',
      titleEn: 'What scale does the built-in `temperature()` function return in MicroPython?',
      titleAr: 'بأي وحدة تقيس الدالة المدمجة `temperature()` درجة الحرارة في مايكروبايثون؟',
      hintEn: '💡 Hint: The standard international metric unit used in science classes!',
      hintAr: '💡 تلميح: الوحدة المترية العالمية المعتمدة في المدارس والعلوم!',
      codeSnippet: `from microbit import *

temp = temperature()
display.scroll(str(temp))`,
      options: [
        { textEn: 'Degrees Celsius (°C)', textAr: 'درجات مئوية سيليزية (°C)' },
        { textEn: 'Degrees Fahrenheit (°F)', textAr: 'درجات فهرنهايت (°F)' },
        { textEn: 'Kelvin (K)', textAr: 'درجات كلفن المطلقة (K)' },
        { textEn: 'Raw Voltage (0-1023)', textAr: 'قراءة الجهد الخام (0-1023)' },
      ],
      correctOptionIndex: 0,
      explanationEn: 'The micro:bit microcontroller sensor returns the estimated core silicon temperature in degrees Celsius (°C).',
      explanationAr: 'يقيس معالج المايكروبت درجة حرارة الشريحة المدمجة بالدرجات المئوية السيليزية (°C).',
      timeLimitSec: 26,
    },
    {
      id: 'w2-q3',
      difficulty: 'medium',
      category: 'sensors',
      titleEn: 'Which accelerometer axis measures forward and backward tilt?',
      titleAr: 'أي محور من محاور مقياس التسارع يقيس إمالة اللوحة للأمام والخلف؟',
      hintEn: '💡 Hint: X is left/right, Z is up/down into the board.',
      hintAr: '💡 تلميح: المحور X لليمين واليسار، بينما Z لأعلى وأسفل عمودياً على اللوحة.',
      codeSnippet: `from microbit import *

x_tilt = accelerometer.get_x() # Left / Right
y_tilt = accelerometer.get_y() # Forward / Backward
z_tilt = accelerometer.get_z() # Up / Down`,
      options: [
        { textEn: 'Y-axis (`accelerometer.get_y()`)', textAr: 'المحور Y (`accelerometer.get_y()`)' },
        { textEn: 'X-axis (`accelerometer.get_x()`)', textAr: 'المحور X (`accelerometer.get_x()`)' },
        { textEn: 'Z-axis (`accelerometer.get_z()`)', textAr: 'المحور Z (`accelerometer.get_z()`)' },
        { textEn: 'Pitch-axis (`accelerometer.get_pitch()`)', textAr: 'محور Pitch' },
      ],
      correctOptionIndex: 0,
      explanationEn: 'The Y-axis measures pitch (forward/backward tilt), while X measures roll (left/right tilt).',
      explanationAr: 'المحور Y يقيس الإمالة الطولية (للأمام والخلف)، بينما المحور X يقيس الإمالة العرضية (لليمين واليسار).',
      timeLimitSec: 26,
    },
    {
      id: 'w2-q4',
      difficulty: 'medium',
      category: 'sensors',
      titleEn: 'What essential step must happen before `compass.heading()` gives accurate compass degrees?',
      titleAr: 'ما هي الخطوة الضرورية قبل أن تعطي الدالة `compass.heading()` درجات دقيقة للاتجاه؟',
      hintEn: '💡 Hint: Tilting the board to calibrate the magnetic sensor!',
      hintAr: '💡 تلميح: إمالة اللوحة لضبط ومعايرة حساس المجال المغناطيسي!',
      codeSnippet: `from microbit import *

# Calibration required on first run
compass.calibrate()
degrees = compass.heading()`,
      options: [
        { textEn: 'Calibration with `compass.calibrate()`', textAr: 'المعايرة عبر `compass.calibrate()`' },
        { textEn: 'Connecting to satellite GPS', textAr: 'الاتصال بنظام الملاحة GPS' },
        { textEn: 'Plugging into a wall socket', textAr: 'التوصيل بمقبس الكهرباء الجداري' },
        { textEn: 'Setting system clock time', textAr: 'ضبط ساعة النظام' },
      ],
      correctOptionIndex: 0,
      explanationEn: '`compass.calibrate()` prompts the user to rotate the micro:bit until a circle of LEDs is filled, calibrating magnetic interference.',
      explanationAr: 'تطلب الدالة `compass.calibrate()` من المستخدم تدوير المايكروبت حتى تكتمل دائرة مصابيح الـ LED لضبط الحساس.',
      timeLimitSec: 26,
    },
    {
      id: 'w2-q5',
      difficulty: 'medium',
      category: 'code-challenge',
      titleEn: '⚡ WEAK POINT: Detect the "shake" gesture to disrupt SENSOR-X!',
      titleAr: '⚡ نقطة ضعف الوحش: اكتشف إيماءة الهز "shake" لتعطيل SENSOR-X!',
      hintEn: '💡 Hint: Use `accelerometer.was_gesture("shake")`',
      hintAr: '💡 تلميح: استخدم الدالة `accelerometer.was_gesture("shake")`',
      isCodeEditorChallenge: true,
      codeEditorPromptEn: 'Complete the gesture check with accelerometer.was_gesture("shake"):',
      codeEditorPromptAr: 'أكمل فحص الإيماءة باستخدام accelerometer.was_gesture("shake"):',
      codeStarter: `from microbit import *

while True:
    if accelerometer.was_gesture("shake"):
        display.show(Image.ANGRY)`,
      expectedPattern: 'accelerometer\\.(was_gesture\\("shake"\\)|current_gesture\\(\\)\\s*==\\s*["\']shake["\'])',
      explanationEn: '`accelerometer.was_gesture("shake")` triggers whenever physical shaking is registered.',
      explanationAr: 'الدالة `accelerometer.was_gesture("shake")` تُفعّل كلما تم رصد حركة هز فيزيائية للمايكروبت.',
      timeLimitSec: 38,
      microbitDisplaySim: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
      ],
    },
  ],

  // WORLD 3: RADIO WASTELAND (Hard — Wireless Communication, Packets, Channels)
  3: [
    {
      id: 'w3-q1',
      difficulty: 'hard',
      category: 'radio',
      titleEn: 'What command MUST be called before any radio transmission can occur?',
      titleAr: 'ما هو الأمر الذي يجب استدعاؤه أولاً قبل إمكانية إجراء أي إرسال لاسلكي؟',
      hintEn: '💡 Hint: Powers on the radio antenna receiver circuitry!',
      hintAr: '💡 تلميح: تشغيل دائرة وهوائي استقبال وبث الراديو!',
      codeSnippet: `from microbit import *
import radio

# Turn on radio hardware
________`,
      options: [
        { textEn: 'radio.on()', textAr: 'radio.on()' },
        { textEn: 'radio.start()', textAr: 'radio.start()' },
        { textEn: 'radio.connect()', textAr: 'radio.connect()' },
        { textEn: 'radio.enable_wifi()', textAr: 'radio.enable_wifi()' },
      ],
      correctOptionIndex: 0,
      explanationEn: '`radio.on()` energizes the 2.4 GHz radio module. It starts disabled to conserve battery energy.',
      explanationAr: 'يقوم الأمر `radio.on()` بتشغيل وحدة الراديو 2.4 غيغاهرتز لتوفير طاقة البطارية عند عدم استخدامها.',
      timeLimitSec: 24,
    },
    {
      id: 'w3-q2',
      difficulty: 'hard',
      category: 'radio',
      titleEn: 'Which method broadcasts a string payload like "PULSE" to other micro:bits?',
      titleAr: 'أي دالة تقوم ببث حمولة نصية مثل "PULSE" إلى أجهزة المايكروبت الأخرى؟',
      hintEn: '💡 Hint: Standard function `radio.send(...)` transmits data packets.',
      hintAr: '💡 تلميح: الدالة القياسية `radio.send(...)` ترسل حزم البيانات.',
      codeSnippet: `import radio
radio.on()

# Broadcast packet
________("PULSE")`,
      options: [
        { textEn: 'radio.send("PULSE")', textAr: 'radio.send("PULSE")' },
        { textEn: 'radio.broadcast("PULSE")', textAr: 'radio.broadcast("PULSE")' },
        { textEn: 'radio.transmit("PULSE")', textAr: 'radio.transmit("PULSE")' },
        { textEn: 'radio.post("PULSE")', textAr: 'radio.post("PULSE")' },
      ],
      correctOptionIndex: 0,
      explanationEn: '`radio.send(message)` transmits up to 251 bytes of text across the currently configured wireless channel.',
      explanationAr: 'تُرسل الدالة `radio.send(message)` حتى 251 بايت من البيانات النصية عبر القناة اللاسلكية المحددة.',
      timeLimitSec: 24,
    },
    {
      id: 'w3-q3',
      difficulty: 'hard',
      category: 'radio',
      titleEn: 'What does `radio.receive()` return when the incoming packet queue is currently empty?',
      titleAr: 'ماذا تُرجع الدالة `radio.receive()` عندما لا تكون هناك أي رسائل واردة في الطابور؟',
      hintEn: '💡 Hint: Python special value representing the absence of a value!',
      hintAr: '💡 تلميح: قيمة بايثون الخاصة التي تدل على غياب القيمة أو الفراغ!',
      codeSnippet: `import radio
radio.on()

incoming = radio.receive()
if incoming is None:
    display.show("-")`,
      options: [
        { textEn: 'None', textAr: 'القيمة None' },
        { textEn: '"" (empty string)', textAr: '"" (نص فارغ)' },
        { textEn: 'False', textAr: 'القيمة False' },
        { textEn: '-1', textAr: 'العدد -1' },
      ],
      correctOptionIndex: 0,
      explanationEn: 'If no incoming radio message has arrived in the buffer, `radio.receive()` evaluates to Python\'s `None`.',
      explanationAr: 'إذا لم تكن هناك أي رسالة لاسلكية واردة في الذاكرة المؤقتة، تُرجع `radio.receive()` القيمة `None`.',
      timeLimitSec: 22,
    },
    {
      id: 'w3-q4',
      difficulty: 'hard',
      category: 'radio',
      titleEn: 'How can two separate robot teams transmit without cross-talk interference?',
      titleAr: 'كيف يمكن لفريقي روبوتات التواصل لاسلكياً دون تداخل الإشارات والرسائل بينهما؟',
      hintEn: '💡 Hint: Change the wireless channel frequency using `radio.config`!',
      hintAr: '💡 تلميح: تغيير تردد القناة اللاسلكية باستخدام `radio.config`!',
      codeSnippet: `import radio

# Set dedicated communication band
radio.config(channel=14)`,
      options: [
        { textEn: 'Set separate channels using `radio.config(channel=...)`', textAr: 'تعيين قنوات منفصلة باستخدام `radio.config(channel=...)`' },
        { textEn: 'Turn down the display brightness', textAr: 'خفض سطوع شاشة العرض' },
        { textEn: 'Run a while loop with sleep(1000)', textAr: 'تشغيل حلقة تكرار مع sleep(1000)' },
        { textEn: 'Use button B instead of button A', textAr: 'استخدام الزر B بدلاً من A' },
      ],
      correctOptionIndex: 0,
      explanationEn: '`radio.config(channel=0..83)` sets the specific frequency channel so only micro:bits on the same channel talk to each other.',
      explanationAr: 'تحدد الدالة `radio.config(channel=0..83)` تردد القناة لكي تتواصل الأجهزة الموجودة على نفس القناة فقط.',
      timeLimitSec: 22,
    },
    {
      id: 'w3-q5',
      difficulty: 'hard',
      category: 'code-challenge',
      titleEn: '⚡ WEAK POINT: Intercept the corrupted radio packet stream!',
      titleAr: '⚡ نقطة ضعف الوحش: اعترض سيل حزم الراديو المشوهة!',
      hintEn: '💡 Hint: Read the message using `msg = radio.receive()`',
      hintAr: '💡 تلميح: اقرأ الرسالة باستخدام السطر `msg = radio.receive()`',
      isCodeEditorChallenge: true,
      codeEditorPromptEn: 'Type msg = radio.receive() to read incoming packet data:',
      codeEditorPromptAr: 'اكتب msg = radio.receive() لقراءة حزمة البيانات الواردة:',
      codeStarter: `from microbit import *
import radio
radio.on()

while True:
    msg = radio.receive()
    if msg:
        display.show(Image.YES)`,
      expectedPattern: 'radio\\.receive\\(\\)',
      explanationEn: '`msg = radio.receive()` pulls the next string packet from the radio buffer.',
      explanationAr: 'السطر `msg = radio.receive()` يسحب الحزمة اللاسلكية التالية من ذاكرة الراديو.',
      timeLimitSec: 32,
    },
  ],

  // WORLD 4: CODE CORE (Expert — Loops, Logic, Syntax, Debugging The Compiler)
  4: [
    {
      id: 'w4-q1',
      difficulty: 'expert',
      category: 'debugging',
      titleEn: 'Identify the fatal syntax error that crashes THE COMPILER in this loop:',
      titleAr: 'حدد الخطأ البرمجي القاتل الذي يوقف تشغيل THE COMPILER في هذه الحلقة:',
      hintEn: '💡 Hint: Python compound headers (while, if, for) require a punctuation mark at the end!',
      hintAr: '💡 تلميح: تتطلب بدايات الجمل المركبة في بايثون علامة ترقيم في نهاية السطر!',
      codeSnippet: `from microbit import *

while True
    if button_a.is_pressed():
        display.show(Image.HAPPY)`,
      options: [
        { textEn: 'Missing colon `:` after `while True`', textAr: 'نقصان النقطتين الرأسيتين `:` بعد `while True`' },
        { textEn: 'Cannot import microbit library', textAr: 'عدم إمكانية استيراد مكتبة microbit' },
        { textEn: '`button_a` must be capitalized', textAr: 'وجوب كتابة `button_a` بحروف كبيرة' },
        { textEn: '`while True` is not supported in MicroPython', textAr: '`while True` غير مدعومة في مايكروبايثون' },
      ],
      correctOptionIndex: 0,
      explanationEn: 'In Python, control statements like `while`, `if`, and `for` must end with a colon `:` to introduce an indented code block.',
      explanationAr: 'في بايثون، يجب أن تنتهي الجمل الشرطية وحلقات التكرار بنقطتين رأسيتين `:` لبدء الكتلة البرمجية المزاحة.',
      timeLimitSec: 22,
    },
    {
      id: 'w4-q2',
      difficulty: 'expert',
      category: 'code-challenge',
      titleEn: 'Trace the code: What character will be shown on the LED display?',
      titleAr: 'تتبع مسار التنفيذ: ما هو الحرف الذي سيظهر على شاشة الـ LED؟',
      hintEn: '💡 Hint: Check each conditional branch from top to bottom (power = 15).',
      hintAr: '💡 تلميح: افحص كل شرط بالتسلسل من الأعلى للأسفل (قيمة power = 15).',
      codeSnippet: `from microbit import *

power = 15
if power > 20:
    display.show("A")
elif power >= 10:
    display.show("B")
else:
    display.show("C")`,
      options: [
        { textEn: 'B', textAr: 'الحرف B' },
        { textEn: 'A', textAr: 'الحرف A' },
        { textEn: 'C', textAr: 'الحرف C' },
        { textEn: 'None (Nothing)', textAr: 'لا شيء' },
      ],
      correctOptionIndex: 0,
      explanationEn: '`power > 20` (15 > 20) is False. `power >= 10` (15 >= 10) is True, so `display.show("B")` executes.',
      explanationAr: 'الشرط الأول 15 > 20 غير صحيح، بينما 15 >= 10 صحيح، لذلك يتم تنفيذ السطر `display.show("B")`.',
      timeLimitSec: 22,
    },
    {
      id: 'w4-q3',
      difficulty: 'expert',
      category: 'debugging',
      titleEn: 'Why will this snippet raise an IndentationError when compiled?',
      titleAr: 'لماذا سيتسبب هذا المقطع في خطأ إزاحة IndentationError عند الترجمة والتنفيذ؟',
      hintEn: '💡 Hint: Python uses whitespace/indentation to define blocks inside loops!',
      hintAr: '💡 تلميح: تعتمد بايثون على المسافات البادئة لتحديد الأكواد التابعة للحلقات!',
      codeSnippet: `from microbit import *

while True:
if button_b.is_pressed():
    display.show(Image.SAD)`,
      options: [
        { textEn: 'The `if` statement is not indented inside the `while` loop block', textAr: 'جملة `if` غير مزاحة بمسافة بادئة داخل حلقة `while`' },
        { textEn: 'Python does not use indentation', textAr: 'لغة بايثون لا تستخدم المسافات البادئة' },
        { textEn: '`button_b` is an invalid hardware identifier', textAr: 'اسم الزر `button_b` غير صالح' },
        { textEn: 'Missing parentheses around `button_b`', textAr: 'نقصان أقواس حول `button_b`' },
      ],
      correctOptionIndex: 0,
      explanationEn: 'All statements inside a `while:` or `if:` header must be indented by at least one space (typically 4 spaces) in Python.',
      explanationAr: 'جميع الأسطر البرمجية التابعة لـ `while:` أو `if:` يجب أن تكون مزاحة بمسافة بادئة (4 مسافات عادة).',
      timeLimitSec: 22,
    },
    {
      id: 'w4-q4',
      difficulty: 'expert',
      category: 'basics',
      titleEn: 'How many times will this `for` loop flash the diamond image?',
      titleAr: 'كم عدد المرات التي ستومض فيها صورة الماسة عبر حلقة `for` التالية؟',
      hintEn: '💡 Hint: `range(4)` generates numbers 0, 1, 2, 3.',
      hintAr: '💡 تلميح: الدالة `range(4)` تُولد الأرقام 0 و 1 و 2 و 3.',
      codeSnippet: `from microbit import *

for i in range(4):
    display.show(Image.DIAMOND)
    sleep(200)
    display.clear()
    sleep(200)`,
      options: [
        { textEn: '4 times (i = 0, 1, 2, 3)', textAr: '4 مرات (i = 0, 1, 2, 3)' },
        { textEn: '5 times (0 to 4 inclusive)', textAr: '5 مرات (من 0 إلى 4)' },
        { textEn: '3 times', textAr: '3 مرات' },
        { textEn: 'Infinite loop', textAr: 'حلقة تكرار لانهائية' },
      ],
      correctOptionIndex: 0,
      explanationEn: '`range(4)` creates an iterable of 4 numbers: [0, 1, 2, 3], executing the loop body 4 times.',
      explanationAr: 'تُولد الدالة `range(4)` أربع قيم: [0, 1, 2, 3]، مما يجعل جسم الحلقة يُنفذ 4 مرات تماماً.',
      timeLimitSec: 20,
    },
    {
      id: 'w4-q5',
      difficulty: 'expert',
      category: 'code-challenge',
      titleEn: '⚡ FINAL OVERRIDE: Construct the infinite event loop to crash THE COMPILER!',
      titleAr: '⚡ الاختراق الحاسم: أنشئ حلقة الأحداث اللانهائية لإسقاط THE COMPILER!',
      hintEn: '💡 Hint: Complete the loop header with `while True:`',
      hintAr: '💡 تلميح: أكمل رأس الحلقة بالعبارة: `while True:`',
      isCodeEditorChallenge: true,
      codeEditorPromptEn: 'Type while True: with colon to establish the perpetual main device loop:',
      codeEditorPromptAr: 'اكتب while True: مع النقطتين الرأسيتين لإنشاء حلقة المعالجة الدائمة:',
      codeStarter: `from microbit import *

while True:
    display.show(Image.ALL_CLOCKS[0])
    sleep(100)`,
      expectedPattern: 'while\\s+True\\s*:',
      explanationEn: '`while True:` creates the canonical infinite embedded loop that continuously processes micro:bit events.',
      explanationAr: 'تُنشئ العبارة `while True:` حلقة التكرار اللانهائية القياسية لمعالجة أحداث وحساسات المايكروبت باستمرار.',
      timeLimitSec: 30,
    },
  ],
};
