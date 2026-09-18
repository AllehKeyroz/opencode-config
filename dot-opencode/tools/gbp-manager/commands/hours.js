import { authenticate } from '../auth.js';
import { API_BASE } from '../config.js';

export async function handleHours(args) {
  const auth = await authenticate();
  const sub = args[0];

  if (!['get', 'update'].includes(sub)) {
    console.error('Uso: gbp hours <get|update> [args...]');
    return;
  }

  const { default: axios } = await import('axios');
  const token = await auth.getAccessToken();
  const headers = {
    Authorization: `Bearer ${token.token}`,
    'Content-Type': 'application/json',
  };

  const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  switch (sub) {
    case 'get': {
      const locId = args[1];
      if (!locId) { console.error('Uso: gbp hours get <locationId>'); return; }
      const res = await axios.get(
        `${API_BASE.businessInformation}/${locId}`,
        { headers, params: { readMask: 'regularHours,specialHours' } },
      );
      const loc = res.data;
      console.log(`\n🕐 Horários - ${loc.title || loc.locationName || ''}`);
      if (loc.regularHours?.periods) {
        console.log('\n   Horário regular:');
        for (const p of loc.regularHours.periods) {
          console.log(`   ${padDay(p.openDay)}: ${p.openTime} - ${p.closeTime}${p.closeDay ? ` (encerra ${p.closeDay})` : ''}`);
        }
      } else {
        console.log('\n   Horário regular: não definido');
      }
      if (loc.specialHours?.specialHourPeriods) {
        console.log('\n   Horários especiais:');
        for (const s of loc.specialHours.specialHourPeriods) {
          console.log(`   ${s.startDate || '?'} ${s.openTime || ''} -> ${s.endDate || '?'} ${s.closeTime || ''}${s.isClosed ? ' (fechado)' : ''}`);
        }
      }
      break;
    }

    case 'update': {
      const locId = args[1];
      if (!locId) {
        console.error('Uso: gbp hours update <locationId>');
        console.error('Formato: gbp hours update <locationId> SEG 09:00 18:00');
        return;
      }

      const periods = [];
      const dayArgs = args.slice(2);
      if (dayArgs.length > 0 && dayArgs.length % 3 === 0) {
        for (let i = 0; i < dayArgs.length; i += 3) {
          const day = dayArgs[i].toUpperCase();
          const open = dayArgs[i + 1];
          const close = dayArgs[i + 2];
          const dayMap = {
            'SEG': 'MONDAY', 'TER': 'TUESDAY', 'QUA': 'WEDNESDAY',
            'QUI': 'THURSDAY', 'SEX': 'FRIDAY', 'SAB': 'SATURDAY', 'DOM': 'SUNDAY',
          };
          const mapped = dayMap[day] || day;
          if (DAYS.includes(mapped)) {
            periods.push({ openDay: mapped, openTime: open, closeTime: close });
          }
        }
      }

      const body = { regularHours: { periods } };
      const res = await axios.patch(
        `${API_BASE.businessInformation}/${locId}`,
        body,
        { headers, params: { updateMask: 'regularHours' } },
      );
      console.log('✅ Horários atualizados com sucesso!');
      for (const p of res.data.regularHours?.periods || []) {
        console.log(`   ${padDay(p.openDay)}: ${p.openTime} - ${p.closeTime}`);
      }
      break;
    }
  }
}

function padDay(day) {
  const map = {
    'MONDAY': 'SEG', 'TUESDAY': 'TER', 'WEDNESDAY': 'QUA',
    'THURSDAY': 'QUI', 'FRIDAY': 'SEX', 'SATURDAY': 'SAB', 'SUNDAY': 'DOM',
  };
  const d = map[day] || day;
  return d.padEnd(5);
}
