export const authPageClass =
  "min-h-screen w-full bg-[#F4F6FB] font-['Inter',sans-serif] flex flex-col justify-center items-center lg:block";

export const authShellClass =
  'grid min-h-screen w-full grid-cols-1 bg-white lg:grid-cols-2 lg:h-screen lg:overflow-hidden';

export const authFormPaneClass =
  'flex flex-col justify-center items-center w-full min-h-screen lg:h-screen overflow-y-auto px-4 py-8 sm:px-8 md:px-12 lg:px-10 xl:px-16';

export const authFormInnerClass = 'mx-auto w-full max-w-[400px] sm:max-w-[420px] py-4 sm:py-6';

export const authMobileBrandClass =
  "mb-6 flex items-center justify-center gap-2.5 font-['Sora',sans-serif] text-lg font-bold text-[#16274F] lg:hidden";

export const authMobileMarkClass =
  'flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-linear-to-br from-[#2F5FE0] to-[#5B8CF5] text-[15px] font-bold text-white';

export const authEyebrowClass =
  'mb-1.5 sm:mb-2 text-[12px] sm:text-[12.5px] font-semibold uppercase tracking-wider text-[#2F5FE0]';

export const authTitleClass =
  "mb-1.5 font-['Sora',sans-serif] text-[22px] sm:text-[25px] font-semibold text-[#16274F]";

export const authSubtitleClass =
  'mb-6 sm:mb-7 text-[13px] sm:text-sm leading-[1.55] text-[#6B7280]';

export const authLabelClass = 'mb-1.5 block text-[13px] font-semibold text-[#16274F]';

export const authInputClass = (focused = false, extra = '') =>
  [
    'w-full rounded-[10px] border px-[13px] py-[10px] sm:py-[11px] text-sm text-[#16274F] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-[#A6ACBB]',
    focused
      ? 'border-[#2F5FE0] bg-white shadow-[0_0_0_3px_rgba(47,95,224,0.12)]'
      : 'border-[#E5E9F2] bg-[#FBFCFE]',
    extra,
  ]
    .filter(Boolean)
    .join(' ');

export const authPrimaryButtonClass = (disabled = false) =>
  [
    'w-full rounded-[10px] px-3 py-2.5 sm:py-3 text-[14px] sm:text-[14.5px] font-semibold text-white transition-colors flex items-center justify-center',
    disabled ? 'cursor-not-allowed bg-[#B7C6F2]' : 'cursor-pointer bg-[#2F5FE0] hover:bg-[#2249BE]',
  ].join(' ');

export const authLinkClass = 'cursor-pointer font-semibold text-[#2F5FE0] hover:underline';

export const authMutedLinkClass =
  'mt-6 cursor-pointer text-center text-[13.5px] text-[#6B7280] hover:text-[#16274F] transition-colors';

export const authBrandPanelClass =
  'hidden lg:flex lg:flex-col lg:justify-between lg:h-full bg-[radial-gradient(circle_at_30%_20%,#16274F_0%,#0E1B38_70%)] px-8 xl:px-12 py-10 xl:py-12 text-white overflow-hidden select-none';

export const authBrandLogoClass =
  "flex items-center gap-2.5 font-['Sora',sans-serif] text-lg font-bold";

export const authBrandMarkClass =
  'flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-linear-to-br from-[#2F5FE0] to-[#5B8CF5] text-[15px] font-bold';

export const authBrandCenterClass =
  'flex flex-col items-center justify-center gap-6 xl:gap-[30px] my-auto py-4 xl:py-6';

export const authBrandHeadlineClass =
  "max-w-[380px] text-center font-['Sora',sans-serif] text-2xl xl:text-[30px] font-semibold leading-[1.3]";

export const authBrandCopyClass =
  'mt-3 max-w-[360px] text-center text-sm xl:text-[17px] leading-[1.6] text-white/60';

export const authBrandFootnoteClass = 'text-xs text-white/40 text-center';

export const authAlertClass =
  'rounded-[10px] border border-[#F6C9C9] bg-[#FDECEC] px-3 py-2.5 text-center text-[13px] font-medium text-[#9A2E2E]';

export const strengthBarClass = (active: boolean, score: number) => {
  const colors = ['bg-[#E5484D]', 'bg-[#E5484D]', 'bg-[#F5A623]', 'bg-[#1FA971]'];
  return [
    'h-1 flex-1 rounded-sm transition-colors',
    active ? colors[Math.min(score - 1, 3)] : 'bg-[#E5E9F2]',
  ].join(' ');
};

export const strengthTextClass = (score: number, hasValue: boolean) => {
  if (!hasValue) return 'mt-2 text-xs text-[#6B7280]';
  if (score <= 1) return 'mt-2 text-xs text-[#E5484D]';
  if (score <= 3) return 'mt-2 text-xs text-[#F5A623]';
  return 'mt-2 text-xs text-[#1FA971]';
};
