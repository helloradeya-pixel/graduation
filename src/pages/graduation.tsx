import { useEffect } from 'react';
import { Base } from '../templates/Base';
import { trackGraduationView } from '@/utils/tracking';

export default function Graduation() {
  useEffect(() => {
    trackGraduationView();
  }, []);

  return <Base />;
}
