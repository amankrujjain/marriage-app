'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { patchContact, toggleHiddenField } from '../../store/biodataSlice';
import { BiodataField } from '../BiodataField';
import { BiodataTextArea } from '../BiodataTextArea';

export function ContactStep() {
  const dispatch = useAppDispatch();
  const contact = useAppSelector((state) => state.biodata.content.contact);
  const hidden = useAppSelector((state) => state.biodata.content.hiddenFields);

  return (
    <div className="flex flex-col gap-4">
      <BiodataField
        label="Contact name"
        name="contactName"
        value={contact.contactName ?? ''}
        onChange={(value) => dispatch(patchContact({ contactName: value }))}
      />
      <BiodataField
        label="Phone"
        name="phone"
        value={contact.phone ?? ''}
        hidden={hidden.includes('contact.phone')}
        onToggleHidden={() => dispatch(toggleHiddenField('contact.phone'))}
        onChange={(value) => dispatch(patchContact({ phone: value }))}
      />
      <BiodataField
        label="Email"
        name="email"
        type="email"
        value={contact.email ?? ''}
        hidden={hidden.includes('contact.email')}
        onToggleHidden={() => dispatch(toggleHiddenField('contact.email'))}
        onChange={(value) => dispatch(patchContact({ email: value }))}
      />
      <BiodataTextArea
        label="Address"
        name="address"
        rows={3}
        value={contact.address ?? ''}
        onChange={(value) => dispatch(patchContact({ address: value }))}
      />
    </div>
  );
}
