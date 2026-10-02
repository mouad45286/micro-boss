import React from 'react';
import { X, BookOpen, Cpu, Radio, Activity, Terminal } from 'lucide-react';
import { Language } from '../../shared/types';
import { translations } from '../i18n/translations';

interface SyntaxCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SyntaxCheatSheetModal: React.FC<SyntaxCheatSheetModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';
  const t = translations[lang];

  const cheatSections = [
    {
      titleEn: '1. Display & LEDs',
      titleAr: '1. الشاشة ومصابيح الـ LED',
      icon: Cpu,
      color: 'text-amber-400 border-amber-500/30',
      items: [
        { code: 'display.show(Image.HAPPY)', descEn: 'Show built-in images (HEART, SAD, SURPRISED, YES, NO)', descAr: 'عرض صورة جاهزة من مكتبة الصور' },
        { code: 'display.scroll("HELLO")', descEn: 'Scrolls text smoothly across 5x5 screen', descAr: 'تمرير نص متحرك عبر شاشة الـ 5x5' },
        { code: 'display.set_pixel(x, y, 9)', descEn: 'Set individual LED brightness (0 to 9)', descAr: 'إضاءة بكسل محدد بدرجة سطوع من 0 إلى 9' },
        { code: 'display.clear()', descEn: 'Turn off all LEDs', descAr: 'إطفاء جميع مصابيح الشاشة' },
      ],
    },
    {
      titleEn: '2. Buttons & Inputs',
      titleAr: '2. الأزرار والمدخلات الفيزيائية',
      icon: Terminal,
      color: 'text-cyan-400 border-cyan-500/30',
      items: [
        { code: 'button_a.is_pressed()', descEn: 'Returns True if button A is held right now', descAr: 'تُرجع True إذا كان الزر A مضغوطاً حالياً' },
        { code: 'button_a.was_pressed()', descEn: 'Returns True if pressed since last check', descAr: 'تُرجع True إذا تم الضغط عليه مسبقاً' },
        { code: 'button_a.get_presses()', descEn: 'Returns total count of presses', descAr: 'تُرجع عدد مرات الضغط الإجمالية' },
      ],
    },
    {
      titleEn: '3. Accelerometer & Tilt Sensors',
      titleAr: '3. مقياس التسارع وحساسات الإمالة',
      icon: Activity,
      color: 'text-emerald-400 border-emerald-500/30',
      items: [
        { code: 'accelerometer.get_x() / get_y() / get_z()', descEn: 'Reads tilt in milli-g force along 3 axes', descAr: 'قراءة التسارع والإمالة على المحاور الثلاثة' },
        { code: 'accelerometer.was_gesture("shake")', descEn: 'Detects shake, freefall, face up, face down', descAr: 'اكتشاف حركات الهز والسقوط الحر والاتجاه' },
        { code: 'temperature()', descEn: 'Internal temperature in Celsius (°C)', descAr: 'قراءة درجة الحرارة بالدرجة المئوية' },
      ],
    },
    {
      titleEn: '4. Radio Wireless Networking',
      titleAr: '4. الاتصال اللاسلكي عبر الراديو',
      icon: Radio,
      color: 'text-pink-400 border-pink-500/30',
      items: [
        { code: 'radio.on()', descEn: 'Power on the radio hardware (must run first)', descAr: 'تشغيل هوائي الراديو (إلزامي في البداية)' },
        { code: 'radio.send("MESSAGE")', descEn: 'Broadcast string packet to nearby micro:bits', descAr: 'بث رسالة نصية لاسلكياً للأجهزة المجاورة' },
        { code: 'msg = radio.receive()', descEn: 'Reads incoming message or None if empty', descAr: 'استقبال الرسالة الواردة أو None إن لم توجد' },
        { code: 'radio.config(channel=7)', descEn: 'Set private frequency channel (0 to 83)', descAr: 'تحديد قناة التردد الخاصة بالمجموعة' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border-2 border-cyan-500/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-black font-mono tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              {t.syntaxReference}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {cheatSections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div key={idx} className={`p-4 rounded-2xl bg-slate-950/80 border ${sec.color}`}>
                <div className="flex items-center gap-2 mb-3 font-bold text-base">
                  <Icon className="w-5 h-5" />
                  <span>{isAr ? sec.titleAr : sec.titleEn}</span>
                </div>
                <div className="space-y-2.5">
                  {sec.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-1"
                    >
                      <code className="font-mono text-xs md:text-sm text-amber-300 font-bold tracking-tight">
                        {item.code}
                      </code>
                      <p className="text-xs text-slate-300 font-medium">
                        {isAr ? item.descAr : item.descEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 text-center">
          <span className="text-xs font-mono text-slate-400">
            MicroPython for BBC micro:bit • Python Editor V3 Standard
          </span>
        </div>
      </div>
    </div>
  );
};
