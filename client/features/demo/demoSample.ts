import type { DemoState } from './demoTypes';

export const SAMPLE_PHOTO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9dfd2"/><stop offset="1" stop-color="#cdbfae"/></linearGradient></defs><rect width="300" height="400" fill="url(#g)"/><circle cx="150" cy="150" r="66" fill="#a08e7c"/><path d="M40 400c8-92 52-140 110-140s102 48 110 140z" fill="#a08e7c"/><text x="150" y="385" font-family="sans-serif" font-size="18" fill="#f6f1ea" text-anchor="middle">Sample photo</text></svg>',
  );

export const INITIAL_DEMO_STATE: DemoState = {
  tpl: 'zari',
  mantra: '॥ श्री गणेशाय नमः ॥',
  docTitle: 'Marriage Biodata',
  name: 'Ananya Ramesh Sharma',
  photo: SAMPLE_PHOTO,
  sections: [
    {
      title: 'Personal Details',
      fields: [
        { label: 'Date of Birth', value: '14 August 1997' },
        { label: 'Time of Birth', value: '06:20 AM' },
        { label: 'Place of Birth', value: 'Ranchi, Jharkhand' },
        { label: 'Height', value: '5 ft 4 in (163 cm)' },
        { label: 'Religion', value: 'Hindu' },
        { label: 'Gotra', value: 'Kashyap' },
        { label: 'Rashi', value: 'Simha (Leo)' },
        { label: 'Nakshatra', value: 'Magha' },
        { label: 'Manglik', value: 'No' },
        { label: 'Complexion', value: '' },
        { label: 'Education', value: 'M.Sc. Chemistry, BHU Varanasi' },
        { label: 'Occupation', value: 'Assistant Professor, Ranchi University' },
        { label: 'Annual Income', value: '₹9.6 LPA' },
        { label: 'Hobbies', value: 'Kathak, reading, cooking' },
        { label: 'Expectations', value: 'Educated, family-oriented partner' },
      ],
    },
    {
      title: 'Family Details',
      fields: [
        { label: 'Father', value: 'Shri Ramesh Kumar Sharma' },
        { label: "Father's Occupation", value: 'Retd. Branch Manager, SBI' },
        { label: 'Mother', value: 'Smt. Sunita Sharma' },
        { label: "Mother's Occupation", value: 'Homemaker' },
        {
          label: 'Siblings',
          value: '1 elder brother (married), Software Engineer, Pune',
        },
        { label: 'Family Type', value: 'Nuclear' },
        { label: 'Native Place', value: 'Gaya, Bihar' },
      ],
    },
    {
      title: 'Contact Details',
      fields: [
        { label: 'Contact Person', value: 'Ramesh Kumar Sharma (Father)' },
        { label: 'Mobile', value: '+91 98765 43210' },
        { label: 'Address', value: 'Lalpur, Ranchi, Jharkhand' },
      ],
    },
  ],
};
