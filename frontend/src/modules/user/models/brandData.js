import anchorBanner from '../../../assets/anchor_banner.png';
import anchorBanner2 from '../../../assets/anchor_banner_2.png';
import anchorBanner3 from '../../../assets/anchor_banner_3.png';
import anchorBanner4 from '../../../assets/anchor_banner_4.png';

import wiresCat from '../../../assets/wires_category.png';
import fansCat from '../../../assets/fans_category.png';
import switchesCat from '../../../assets/switches_category.png';
import lightingCat from '../../../assets/lighting.jpg';
import tapCat from '../../../assets/tap.jpg';
import mirrorsCat from '../../../assets/mirrors_premium.png';
import furnitureCat from '../../../assets/furniture.jpg';

export const brandData = {
  anchor: {
    name: 'Anchor',
    banners: [anchorBanner, anchorBanner2, anchorBanner3, anchorBanner4],
    categories: [
      { id: 1, name: 'Wires & Cables', image: wiresCat, slug: 'wires-and-cables' },
      { id: 2, name: 'Fans', image: fansCat, slug: 'fans' },
      { id: 3, name: 'Switches & Sockets', image: switchesCat, slug: 'switches-and-sockets' },
      { id: 4, name: 'LED Lighting', image: lightingCat, slug: 'lighting' },
      { id: 5, name: 'MCBs & DBs', image: 'https://images.unsplash.com/photo-1558444479-28198f79396e?q=80&w=400', slug: 'mcb' },
    ]
  },
  greenply: {
    name: 'Greenply',
    banners: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200'
    ],
    categories: [
      { id: 1, name: 'Plywood', image: furnitureCat, slug: 'plywood' },
      { id: 2, name: 'Blockboards', image: furnitureCat, slug: 'blockboard' },
      { id: 3, name: 'Flush Doors', image: 'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?q=80&w=400', slug: 'doors' },
    ]
  },
  hettich: {
    name: 'Hettich',
    banners: [
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=1200',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200'
    ],
    categories: [
      { id: 1, name: 'Hinges', image: 'https://images.unsplash.com/photo-1585350849465-35c85caee091?q=80&w=400', slug: 'hinges' },
      { id: 2, name: 'Drawer Systems', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=400', slug: 'drawers' },
      { id: 3, name: 'Sliding Systems', image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=400', slug: 'sliding' },
    ]
  },
  nippon: {
    name: 'Nippon Paint',
    banners: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200',
      'https://images.unsplash.com/photo-1562663474-6cbb3fee4bc3?q=80&w=1200'
    ],
    categories: [
      { id: 1, name: 'Interior Paint', image: 'https://images.unsplash.com/photo-1562663474-6cbb3fee4bc3?q=80&w=400', slug: 'interior-paint' },
      { id: 2, name: 'Exterior Paint', image: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=400', slug: 'exterior-paint' },
      { id: 3, name: 'Wood & Metal', image: 'https://images.unsplash.com/photo-1589330694653-df61f9247161?q=80&w=400', slug: 'wood-metal' },
    ]
  },
  prince: {
    name: 'Prince Pipes',
    banners: [
      'https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=1200',
      'https://images.unsplash.com/photo-1621905252507-b354bcadc0d6?q=80&w=1200'
    ],
    categories: [
      { id: 1, name: 'CPVC Pipes', image: 'https://images.unsplash.com/photo-1621905252507-b354bcadc0d6?q=80&w=400', slug: 'cpvc' },
      { id: 2, name: 'UPVC Pipes', image: 'https://images.unsplash.com/photo-1588720294158-941e3d749444?q=80&w=400', slug: 'upvc' },
      { id: 3, name: 'SWR Systems', image: 'https://images.unsplash.com/photo-1621905252507-b354bcadc0d6?q=80&w=400', slug: 'swr' },
    ]
  },
  cera: {
    name: 'Cera',
    banners: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200',
      'https://images.unsplash.com/photo-1600566752355-3979ff69a3ec?q=80&w=1200'
    ],
    categories: [
      { id: 1, name: 'Sanitaryware', image: 'https://images.unsplash.com/photo-1600566752355-3979ff69a3ec?q=80&w=400', slug: 'sanitaryware' },
      { id: 2, name: 'Faucets', image: tapCat, slug: 'faucets' },
      { id: 3, name: 'Designer Mirrors', image: mirrorsCat, slug: 'mirrors' },
    ]
  },
  havells: {
    name: 'Havells',
    banners: [
      'https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1200',
      'https://images.unsplash.com/photo-1558444479-28198f79396e?q=80&w=1200'
    ],
    categories: [
      { id: 1, name: 'Fans', image: fansCat, slug: 'fans' },
      { id: 2, name: 'Professional Lighting', image: lightingCat, slug: 'lighting' },
      { id: 3, name: 'Switchgear', image: 'https://images.unsplash.com/photo-1558444479-28198f79396e?q=80&w=400', slug: 'switchgear' },
    ]
  },
  bosch: {
    name: 'Bosch',
    banners: [
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1200',
      'https://images.unsplash.com/photo-1530124560676-4702167d3056?q=80&w=1200'
    ],
    categories: [
      { id: 1, name: 'Power Tools', image: 'https://images.unsplash.com/photo-1530124560676-4702167d3056?q=80&w=400', slug: 'power-tools' },
      { id: 2, name: 'Accessories', image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=400', slug: 'accessories' },
    ]
  },
  taparia: {
    name: 'Taparia',
    banners: [
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=1200',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1200'
    ],
    categories: [
      { id: 1, name: 'Hand Tools', image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=400', slug: 'hand-tools' },
      { id: 2, name: 'Tool Sets', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=400', slug: 'tool-sets' },
    ]
  }
};
