import React from "react";
import styled from "styled-components/native";

const TeamListContainer = styled.View`
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const TeamListTitle = styled.View`
  margin-bottom: 4px;
`;

const TeamListTitleText = styled.Text`
  font-weight: 600;
`;

const TeamListInfo = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const TeamListUser = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 8px;
`;

const TeamListAvatar = styled.Image`
  margin: 4px;
`;

const TeamListUsername = styled.Text`
  margin: 4px;
`;

export default function ContestTeamList(contestTeam: any) {
  return (
    <TeamListContainer>
      <TeamListTitle>
        <TeamListTitleText>{contestTeam.teamName}</TeamListTitleText>
      </TeamListTitle>
      <TeamListInfo>
        {contestTeam.contestUser.map((item: any) => {
          return (
            <TeamListUser key={item.id}>
              <TeamListAvatar
                source={
                  item.user.avatar === null || item.user.avatar === undefined
                    ? require(`../../assets/emptyAvatar.png`)
                    : { uri: item.user.avatar }
                }
              />
              <TeamListUsername>{item.user.username}</TeamListUsername>
            </TeamListUser>
          );
        })}
      </TeamListInfo>
    </TeamListContainer>
  );
}
