import { Camera, Pencil } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs max-w-3xl">
        <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-b from-blue-50/20 to-transparent">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
                alt="Eleanor Vance"
                className="w-24 h-24 rounded-2xl object-cover border border-slate-100"
              />
              <button
                type="button"
                className="absolute -bottom-1 -right-1 bg-blue-900 text-white p-1.5 rounded-full border-2 border-white shadow-xs hover:bg-blue-800 transition-colors cursor-pointer"
                aria-label="Upload profile picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                Eleanor Vance
              </h1>
              <p className="text-sm text-slate-400 mt-1">eleanor.vance@apexledger.com</p>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="border-t border-slate-200/80" />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                First Name
              </span>
              <span className="block text-sm font-semibold text-slate-700">Eleanor</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                Email Address
              </span>
              <span className="block text-sm font-semibold text-slate-700">
                eleanor.vance@apexledger.com
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                Last Name
              </span>
              <span className="block text-sm font-semibold text-slate-700">Vance</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                Phone Number
              </span>
              <span className="block text-sm font-semibold text-slate-700">+1 (555) 019-2834</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                Gender
              </span>
              <span className="block text-sm font-semibold text-slate-700">Female</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
