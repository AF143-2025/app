# لوحة تحكم المدير المستقلة • متجر سما الخضراء 🛡️

هذا المجلد يحتوي على **تطبيق لوحة تحكم المدير المستقل بالكامل**، المنفصل عن واجهة العميل وتطبيق المتجر، والذي يمكن رفعه على أي استضافة خارجية أو نطاق فرعي (Subdomain) بمفرده.

---

## 🚀 طريقة التشغيل والرفع

### 1. إعداد رابط السيرفر (Backend API)
داخل ملف `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```
* **محلياً على جهازك:** اتركه `http://localhost:3000` (رابط سيرفر المتجر).
* **عند الرفع على استضافة خارجية:** غيّر الرابط إلى رابط متجرك الفعلي، مثلاً:
```env
NEXT_PUBLIC_API_URL=https://sama-alkhadraa.com
```

---

### 2. التشغيل المحلي للتجربة (Local Development)
```bash
# الانتقال لمجلد لوحة المدير
cd admin-dashboard

# تثبيت الحزم
npm install

# تشغيل لوحة التحكم على المنفذ 3001
npm run dev
```
افتح المتصفح على:
👉 **[http://localhost:3001](http://localhost:3001)**

---

### 3. الرفع على استضافة خارجية (Vercel / Render / Netlify / VPS)

#### أ. الرفع على Vercel أو Render:
1. ارفع مجلد `admin-dashboard` إلى مستودع GitHub خاص به.
2. اربطه بـ Vercel أو Render.
3. في المتغيرات البيئية (Environment Variables) أضف:
   - `NEXT_PUBLIC_API_URL`: رابط المتجر الرئيسي.
4. اضغط Deploy وسيتم تشغيل اللوحة برابط مستقل (مثلاً: `https://admin.sama-alkhadraa.com`).

#### ب. الرفع على سيرفر خاص VPS:
```bash
cd admin-dashboard
npm install
npm run build
npm run start
```

---

### 🔐 بيانات الدخول الافتراضية
* **البريد:** `admin@store.com`
* **كلمة المرور:** `123456`
