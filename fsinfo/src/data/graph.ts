import type { Edge, Node } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';

export type TrendCluster = {
  id: string;
  title: string;
  color: string;
  trends: string[];
};

export const clusters: TrendCluster[] = [
  { id: 'MT01', title: 'مدیریت جمعیت‌شناسی', color: '#FFD94A', trends: ['سالمندی / میانسالی','طبقه پرجمعیت جدید','جایگزینی مراجع جدید و تحول فرایند مرجعیت و تقلید','خانواده‌گرایی','جمعیت و باروری','مهاجرت'] },
  { id: 'MT02', title: 'ساختارهای متحول قدرت در جهان آینده', color: '#C8A866', trends: ['انتقال قدرت از غرب به شرق','اجتماع‌محوری','محلی‌گرایی','ظهور بیشتر نهادهای علمی‌دینی عراق','افزایش انسجام شیعی در منطقه'] },
  { id: 'MT03', title: 'هوش مصنوعی و داده‌محوری', color: '#5A62FF', trends: ['تصمیم‌گیری داده‌محور','هوش مصنوعی اجتهاد','هوش مصنوعی دینی','دستیاران مجازی روحانی','فناوری زنجیره بلوکی (بلاک‌چین)'] },
  { id: 'MT04', title: 'تحول علم و معرفت', color: '#2F9CFF', trends: ['دیجیتالی‌شدن نظام دانش','علم ۲ (باز و مشارکتی)','علوم محاسباتی','علوم شناختی','فناوری به جای علم','کاربردی‌شدن','آموزش شخصی‌سازی‌شده','آموزش مادام‌العمر','یادگیری حین اقدام','گسترش میان‌رشته‌گی'] },
  { id: 'MT05', title: 'معنویت‌گرایی', color: '#B8F34A', trends: ['واگرایی، تنوع و تکثر دینی','افول سکولاریسم','معنویت‌گرایی‌های نوین دینی','تکنولوژی‌های معنویت','اقتصاد معنویت','تعامل عمیق','مشاغل مرتبط با معنا و روح'] },
  { id: 'MT06', title: 'تحول شناختی دین', color: '#A48BFF', trends: ['اصل ساده‌سازی ـ دین ساده‌سازی‌شده','دین تصویری و نمادگرایانه','مونتاژ، کولاژ و شخصی‌سازی دینی','دینداری بدون مقام','دلبستگی به‌جای ایمان','دین به‌مثابه درمانگر (مراقبت معنوی)','دینداری به معنای خدمت‌رسانی','جایگزینی داده به‌جای معرفت','فناوری‌های شناختی'] },
  { id: 'MT07', title: 'شهرنشینی', color: '#62DF79', trends: ['تبلیغ مسئله‌محور','طلبگی شهروندی','دین در عصر آسیب‌های اجتماعی'] },
  { id: 'MT08', title: 'زنانه‌شدن', color: '#EE8CAC', trends: ['رشد طلاب خواهر','دین برای زنان (زن و خانواده به‌عنوان مخاطب کلیدی)','رشد زنانگی'] },
  { id: 'MT09', title: 'عصر بی‌نظمی', color: '#D05B89', trends: ['بی‌اعتمادی فزاینده','مشارکتی شدن دین'] },
  { id: 'MT10', title: 'مهارت‌های آینده', color: '#FFB84D', trends: ['عصر خلاقیت و کارآفرینی','مهارت‌محور شدن آموزش','بازاریابی محتوای دینی (اقتصاد توجه)','هم‌آفرینی خدمت‌رسانی دینی','روح زمانه بصری'] },
  { id: 'MT11', title: 'سبک زندگی سالم', color: '#67D6B0', trends: ['پزشکی‌شدن همه‌چیز','اولویت پیشگیری','سلامت همه‌جانبه ـ سلامت معنوی','مراقبت بهداشتی خوداتکا'] },
  { id: 'MT12', title: 'تاب‌آوری', color: '#45C58A', trends: ['تغییرات اقلیم و زیست‌محیط','توسعه پایدار','پایداری به‌عنوان اخلاق حسنه یا دین','الهیات تاب‌آوری','روایت‌گری امید فعال','الهیات آسیب‌پذیری','بازکشف ثروت‌های تمدنی'] },
  { id: 'MT13', title: 'تحول حکمرانی', color: '#7D8BFF', trends: ['شفافیت','غیررسمی‌شدن','تمرکززدایی','گواهی‌گرایی','سازمان‌های چابک','یادگیری پیوسته و یادگیری حین عمل','شاملیت و تنوع','حوزه فراگیر','حکمرانی الگوریتمی','چالش توزیع در حکمرانی (مرحله اجرا)'] },
  { id: 'MT14', title: 'تحول زیست‌فناورانه', color: '#77C6FF', trends: ['انسان سایبورگ','بهینه‌سازی ژنتیک تولید نسل'] }
];

const center = { x: 1240, y: 820 };
const macroRx = 900;
const macroRy = 650;

export function createInitialGraph(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [{
    id: 'CORE',
    type: 'trend',
    position: center,
    data: { label: 'حوزه آینده', level: 'core', color: '#354BFF', textSize: 28 },
    style: { width: 230, height: 150 }
  }];
  const edges: Edge[] = [];

  clusters.forEach((cluster, index) => {
    const angle = (index / clusters.length) * Math.PI * 2 - Math.PI / 2;
    const macroPos = {
      x: center.x + Math.cos(angle) * macroRx,
      y: center.y + Math.sin(angle) * macroRy
    };
    nodes.push({
      id: cluster.id,
      type: 'trend',
      position: macroPos,
      data: { label: cluster.title, level: 'macro', color: cluster.color, textSize: 18, macroId: cluster.id },
      style: { width: 205, height: 105 }
    });
    edges.push({
      id: `CORE-${cluster.id}`,
      source: 'CORE',
      target: cluster.id,
      type: 'smoothstep',
      data: { kind: 'hierarchy' },
      style: { stroke: cluster.color, strokeWidth: 2.2, opacity: 0.55 }
    });

    const spread = Math.max(1, cluster.trends.length - 1);
    cluster.trends.forEach((trend, trendIndex) => {
      const fan = (trendIndex / spread - 0.5) * 1.55;
      const outward = angle + fan;
      const radius = 235 + (trendIndex % 2) * 42;
      const id = `${cluster.id}-T${String(trendIndex + 1).padStart(2, '0')}`;
      nodes.push({
        id,
        type: 'trend',
        position: {
          x: macroPos.x + Math.cos(outward) * radius,
          y: macroPos.y + Math.sin(outward) * radius
        },
        data: { label: trend, level: 'trend', color: cluster.color, textSize: 13, macroId: cluster.id },
        style: { width: 175, height: 68 }
      });
      edges.push({
        id: `${cluster.id}-${id}`,
        source: cluster.id,
        target: id,
        type: 'smoothstep',
        data: { kind: 'hierarchy' },
        style: { stroke: cluster.color, strokeWidth: 1.6, opacity: 0.68 }
      });
    });
  });

  const cross = [
    ['MT03', 'MT10', 'هوش مصنوعی ← مهارت‌های آینده'],
    ['MT03', 'MT04', 'هوش مصنوعی ← تحول دانش'],
    ['MT07', 'MT06', 'شهرنشینی ← تحول شناختی دین']
  ];
  cross.forEach(([source, target, label], index) => {
    edges.push({
      id: `X-${index + 1}`,
      source,
      target,
      label,
      type: 'bezier',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { kind: 'cross', verified: false },
      className: 'cross-edge',
      style: { stroke: '#B62770', strokeWidth: 2.1, opacity: 0.78 }
    });
  });

  return { nodes, edges };
}
