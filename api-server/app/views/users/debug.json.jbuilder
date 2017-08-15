json.array! @users do |user|
  json.id user.id
  json.device_id user.device_id
  json.name user.name
  json.score user.score
  json.rank user.rank
  json.win_count user.win_count
  json.lose_count user.lose_count
  json.billing user.billing
  json.login_key user.login_key
end