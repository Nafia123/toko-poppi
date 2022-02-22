import useTranslation from 'next-translate/useTranslation';

export default function Footer() {
  const { t } = useTranslation('common');
  return (
    <footer className="w-screen md:w-full lg:w-fit drop-shadow flex inset-x-0 bottom-0 p-10 mb-12 lg:mb-0 z-0 grid grid-cols-2 lg:grid-cols-3">
      <div>
        <p className="text-xl align-middle mt-1 font-bold co">
          {t('footer.address')}
          :
        </p>
        <p className="text-md">Toko Poppi</p>
        <p className="text-md">Bagijnhof 13, 1671CC</p>
        <p className="text-md">Medemblik</p>
      </div>
      <div className="">
        <p className="text-xl align-middle mt-1 font-bold">Contact:</p>
        <p className="text-md">0227 745 768</p>
        <p className="text-md">tokopoppi@outlook.com</p>
      </div>
      <div className="w-56  grid grid-cols-2">
        <p className="text-xl align-middle mt-1 font-bold col-span-2">
          {t('footer.openingHours')}
          :
        </p>
        <p className="text-sm col-span-1">
          {t('weekDays.monday')}
          :
        </p>
        <p className="col-span-1 text-sm"> 9:00 - 18:00 </p>
        <p className="text-sm ">
          {' '}
          {t('weekDays.tuesday')}
          :
        </p>
        <p className="text-sm "> 9:00 - 18:00</p>
        <p className="text-sm">
          {' '}
          {t('weekDays.wednesday')}
          :
        </p>
        <p className="text-sm ">9:00 - 18:00</p>
        <p className="text-sm">
          {' '}
          {t('weekDays.thursday')}
          :
        </p>
        <p className="text-sm "> 9:00 - 18:00 </p>
        <p className="text-sm">
          {' '}
          {t('weekDays.friday')}
          :
        </p>
        <p className="text-sm "> 9:00 - 18:00 </p>
        <p className="text-sm">
          {' '}
          {t('weekDays.saturday')}
          :
        </p>
        <p className="text-sm "> 9:00 - 18:00 </p>
        <p className="text-sm">
          {' '}
          {t('weekDays.sunday')}
          :
        </p>
        <p className="text-sm">{t('footer.closed')}</p>
      </div>
    </footer>
  );
}
