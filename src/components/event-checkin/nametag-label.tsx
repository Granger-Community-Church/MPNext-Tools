import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { NametagData } from '@/lib/dto';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  eventTitle: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  eventDate: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
    color: '#444444',
  },
});

interface NametagLabelProps {
  data: NametagData;
}

export function NametagLabel({ data }: NametagLabelProps) {
  const isInitial = data.layout === 'first-last-initial';
  const nameLine = isInitial
    ? `${data.firstName} ${data.lastName[0]}.`
    : `${data.firstName} ${data.lastName}`;

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: 'Poppins',
          fontWeight: 700,
          fontSize: isInitial ? 28 : 24,
          textAlign: 'center',
        }}
      >
        {nameLine}
      </Text>
      <Text style={styles.eventTitle}>{data.eventTitle}</Text>
      <Text style={styles.eventDate}>{data.eventDate}</Text>
    </View>
  );
}
