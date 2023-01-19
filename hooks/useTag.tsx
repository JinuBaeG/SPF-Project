import { gql, useQuery } from "@apollo/client";

const SEETAG_QUERY = gql`
  query seeTag($offset: Int!) {
    seeTag(offset: $offset) {
      id
      name
    }
  }
`;

export default function useTag() {
  const { data: tagList } = useQuery(SEETAG_QUERY, {
    variables: {
      offset: 0,
    },
  });

  const tagData: any = [];
  if (tagList) {
    tagList?.seeTag.map((tag: any) => {
      tagData.push({
        id: tag.id,
        name: tag.name,
        isUse: false,
        isCustom: false,
      });
    });
  }

  return tagData;
}
