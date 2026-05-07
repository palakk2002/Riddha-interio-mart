import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Asset Imports
import ContractorImg from '../../../assets/promo_contractor.png';
import DesignerImg from '../../../assets/promo_designer.png';
import BuildingImg from '../../../assets/promo_building.png';
import GiftImg from '../../../assets/promo_giftbox.png';

const PromoCard = ({ title, items, btnText, bg, textColor, btnColor, img, link }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`${bg} rounded-[20px] md:rounded-[24px] p-3.5 md:p-8 flex items-center justify-between overflow-hidden relative group h-[155px] md:h-[220px] border border-gray-100/50`}
  >
    <div className="z-10 flex flex-col justify-between h-full max-w-[58%] md:max-w-[60%]">
      <div className="flex-1">
        <h3 className={`text-[12px] md:text-xl font-black mb-1 md:mb-3 leading-tight ${textColor}`}>{title}</h3>
        {items && (
          <ul className="space-y-0.5 md:space-y-1">
            {items.map((item, i) => (
              <li key={i} className="text-gray-500 md:text-gray-600 text-[8px] md:text-xs font-bold flex items-center gap-1">
                <span className="w-0.5 h-0.5 rounded-full bg-gray-400" /> {item}
              </li>
            ))}
          </ul>
        )}
        {!items && (
          <p className="text-gray-600 text-[10px] md:text-xs font-bold leading-relaxed">
            Refer Your Friends <br /> & Earn Rewards
          </p>
        )}
      </div>

      <Link
        to={link || "#"}
        className={`mt-auto w-fit flex items-center gap-1 md:gap-2 px-2 py-1 md:px-5 md:py-2.5 rounded-lg md:rounded-xl text-[8px] md:text-xs font-black bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all ${btnColor}`}
      >
        {btnText} <FiArrowRight className="text-[9px] md:text-xs" />
      </Link>
    </div>

    <div className="absolute right-0 top-0 bottom-0 w-[42%] md:w-[45%] h-full flex items-end justify-end pointer-events-none">
      <img
        src={img}
        alt={title}
        className="w-full h-full object-cover md:object-contain group-hover:scale-105 transition-transform duration-500"
      />
    </div>
  </motion.div>
);

const PromoGrid = () => {
  const promos = [
    {
      title: "Contractor Benefits",
      items: ["Special Pricing", "Bulk Deals", "Priority Support"],
      btnText: "Join Now",
      bg: "bg-[#F4F9F8]",
      textColor: "text-[#004D40]",
      btnColor: "text-[#004D40]",
      img: ContractorImg,
      link: "/contractor-registration"
    },
    {
      title: "Interior Designer Zone",
      items: ["Premium Materials", "For Your Projects"],
      btnText: "Join Now",
      bg: "bg-[#FFF4F7]",
      textColor: "text-[#D81B60]",
      btnColor: "text-[#D81B60]",
      img: DesignerImg,
      link: "/designer-registration"
    },
    {
      title: "Builder Benefits",
      items: ["Reliable Supplies", "At Best Prices"],
      btnText: "Join Now",
      bg: "bg-[#FFF8F2]",
      textColor: "text-[#F57C00]",
      btnColor: "text-[#F57C00]",
      img: BuildingImg,
      link: "/builder-registration"
    },
    {
      title: "Refer & Earn",
      btnText: "Know More",
      bg: "bg-[#F8F4FF]",
      textColor: "text-[#7E57C2]",
      btnColor: "text-[#7E57C2]",
      img: GiftImg,
      link: "/referral"
    }
  ];

  return (
    <section className="py-6 md:py-10 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {promos.map((promo, idx) => (
            <PromoCard key={idx} {...promo} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoGrid;
