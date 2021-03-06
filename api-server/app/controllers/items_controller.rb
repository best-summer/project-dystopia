class ItemsController < ApplicationController
  def index
    # 全アイテムの情報を表示する(デバッグ用)
    @items = Item.all.as_json(except: ['updated_at', 'created_at'])
    render json: @items
  end

  def show
    #  POST /users/:name/items?login_key
    # ユーザの所有しているアイテムを表示する
    @user = User.find_by(device_id: params[:device_id])
    @items = @user.item
    if @user.authenticate_only_login_key?(params)
      render 'show', formats: 'json'
    else
      render json: {status: 'ng', message: 'Wrong login key'}
    end
  end

  def create
    #  POST /users/:name/items
    # ユーザのアイテムを作成する
    p params
    @user = User.find_by(device_id: params[:device_id])
    @item = Item.new(name: params[:item][:name], value: params[:item][:value],
                      user_id: @user.id)

    if @user.authenticate_only_login_key?(params) && @item.save
      # ユーザの課金合計額にアイテムの価格を加算していく。モデルに移動予定
      @user[:billing] += @item[:value]
      @user.save
      render 'create', formats: 'json'
    elsif !@user.authenticate_only_login_key?(params)
      render json: {status: 'ng', message: 'Wrong login key'}
    elsif !@item.save
      render json: {status: 'ng', message: 'Item is already exists or key is not enough'}
    end
  end

  #  PATCH /users/:name/items
  # ユーザのアイテム情報の更新をする
  def update
    @user = User.find_by(device_id: params[:device_id])
    @item = @user.item.find_by(device_id: params[:item][:device_id])
    if @item.nil?
      render json: {status: 'ng', message: 'user_name or item_name is wrong'}
      return
    end
    for param in params[:item]
      @item[param] = params[:item][param]
    end
    if @user.authenticate_only_login_key?(params) && @item.save
      render 'update', formats: 'json'
    elsif !@user.authenticate_only_login_key?(params)
      render json: {status: 'ng', message: 'Wrong login key'}
    elsif !@item.save
      render json: {status: 'ng', message: 'Key is not enough'}
    end
  end

  # ガチャでアイテムを購入する
  # POST /gacha
  def gacha
    p params
    @user = User.find_by(device_id: params[:device_id])
    @item = Item.new(user_id: @user.id)

    if @user.nil?
      render json: {status: 'ng', message: 'Such a name is not exit'}
      return
    end

    # ガチャのランクによって課金額とレア出現確率を決める
    if params[:value] == 'low'
      @user[:billing] += 500
      @item[:value] = 500
      probability = 0.1
    elsif params[:value] == 'middle'
      @user[:billing] += 1000
      @item[:value] = 1000
      probability = 0.3
    elsif params[:value] == 'high'
      @user[:billing] += 3000
      @item[:value] = 3000
      probability = 0.7
    end

    # アイテム抽選
    if rand(0..1.0) < probability
      name = 'Rare'
      rarity  = 'R'
      if rand(0..1.0) < 0.5
        name = 'Super Rare'
        rarity  = 'SR'
        if rand(0 ..1.0) < 0.5
          rarity  = 'SSR'
          name = 'Special Super Rare'
        end
      end
    else
      rarity = 'N'
      name = 'Normal'
    end

    @item[:name] = name
    @item[:rarity] = rarity

    if @item.save
      render json: {status: 'new', normal: name, rarity: rarity}
    else
      render json: {status: 'duplicate', normal: name, rarity: rarity}
    end
    # 課金額を加算する
    @user.save
  end

  def destroy
  end
end
