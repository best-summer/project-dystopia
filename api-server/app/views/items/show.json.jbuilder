json.items do
  json.array! @items do |item|
    json.name item.name
    json.value item.value
    json.number item.number
  end
end