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
    className={`${bg} rounded-[24px] p-6 md:p-8 flex items-center justify-between overflow-hidden relative group h-[180px] md:h-[220px] border border-gray-100/50`}
  >
    <div className="z-10 flex flex-col justify-between h-full max-w-[60%]">
      <div>
        <h3 className={`text-lg md:text-xl font-black mb-3 ${textColor}`}>{title}</h3>
        {items && (
          <ul className="space-y-1">
            {items.map((item, i) => (
              <li key={i} className="text-gray-600 text-[10px] md:text-xs font-bold flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-gray-400" /> {item}
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
        className={`mt-4 w-fit flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all ${btnColor}`}
      >
        {btnText} <FiArrowRight />
      </Link>
    </div>

    <div className="absolute right-[-10px] md:right-0 bottom-0 w-[45%] h-[90%] flex items-end justify-end pointer-events-none">
      <img
        src={img}
        alt={title}
        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {promos.map((promo, idx) => (
            <PromoCard key={idx} {...promo} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoGrid;
