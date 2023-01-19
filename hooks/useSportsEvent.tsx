import { gql, useQuery } from "@apollo/client";

const SEESPORTSEVENT_QUERY = gql`
  query seeSportsEvent($offset: Int) {
    seeSportsEvent(offset: $offset) {
      id
      name
    }
  }
`;

export default function useSportsEvent() {
  const { data: eventList } = useQuery(SEESPORTSEVENT_QUERY, {
    variables: {
      offset: 0,
    },
  });

  const tagData: any = [];

  if (eventList && eventList !== undefined && eventList !== null) {
    eventList.seeSportsEvent.map((event: any) => {
      tagData.push({
        id: event.id,
        name: event.name,
        isChecked: false,
      });
    });
  }

  return tagData;
}
