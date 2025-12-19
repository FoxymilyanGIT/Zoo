export const Footer = () => (
  <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white mt-20 border-t-4 border-brand-600">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-bold mb-1">🦁 ZooPark</p>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} Все права защищены.</p>
        </div>
        <div className="text-sm text-slate-400">
          <p>💳 Оплата билетов эмулируется в учебных целях</p>
        </div>
      </div>
    </div>
  </footer>
);



