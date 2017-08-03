class ItemsController < ApplicationController
  def index
    # 全アイテムの情報を表示する(デバッグ用)
    @items = Item.all.as_json
    render json: @items
  end

  def show
    #  POST /users/:name/items?login_key
    # ユーザの所有しているアイテムを表示する
    @user = User.find_by(name: params[:name])
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
    @user = User.find_by(name: params[:name])
    @item = Item.new(name: params[:item][:name], value: params[:item][:value],
                     user_id: @user.id)
    if @user.authenticate_only_login_key?(params) && @item.save
      render 'create', formats: 'json'
    elsif !@user.authenticate_only_login_key?(params)
      render json: {status: 'ng', message: 'Wrong login key'}
    elsif !@item.save(params)
      render json: {status: 'ng', message: 'Item is already exists or Key is not enough'}
    end
  end

  #  PATCH /users/:name/items
  # ユーザのアイテム情報の更新をする
  def update
    @user = User.find_by(name: params[:name])
    @item = @user.item.find_by(name: params[:item][:name])
    if @item.nil?
      render json: {status: 'ng', message: 'user_name or item_name is wrong'}
      return
    end
    for param in params[:item]
      @item[param] = params[:item][param]
    end
    # これまでの課金合計額を計算して保存しておく TODO:モデルへ移動したい
    # billing_sum = @item.sum(:value)
    # @user[:billing] = billing_sum
    # @user.save
    if @user.authenticate_only_login_key?(params) && @item.save
      render 'update', formats: 'json'
    elsif !@user.authenticate_only_login_key?(params)
      render json: {status: 'ng', message: 'Wrong login key'}
    elsif !@item.save(params)
      render json: {status: 'ng', message: 'Key is not enough'}
    end
  end

  def destroy
  end
end
