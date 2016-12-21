module.exports = actions => {
  const result = {
    voteUp: [],
    voteDown: [],
    answered: [],
    followed: [],
    comment: [],
    collected: [],
    length: actions.length
  };
  actions.forEach(item => {
    let verb = item.verb;
    switch (verb) {
      case 'ANSWER_VOTE_UP':
        result.voteUp.push(item);
        break;
      case 'MEMBER_VOTEUP_ARTICLE':
        result.voteUp.push(item);
        break;
      case 'ANSWER_VOTE_DOWN':
        result.voteDown.push(item);
        break;
      case 'QUESTION_FOLLOW':
        result.followed.push(item);
        break;
      case 'MEMBER_FOLLOW_COLUMN': 
        result.followed.push(item);
        break;
    }
  });
  return result;
}