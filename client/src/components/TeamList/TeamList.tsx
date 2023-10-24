export type TTeamListProps = {
  userId: number;
};

export const TeamList = (props: TTeamListProps) => {
  const { userId } = props;

  return <div>TeamList for user #{userId}</div>;
};
