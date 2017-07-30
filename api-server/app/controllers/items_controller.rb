class ItemsController < ApplicationController
  def index
    # 全ユーザの情報を表示する
    @items = Item.all.as_json
    render json: @items
  end

  def show
    @user = User.find_by(name: params[:name])
    p "aaaaaaaa"
    p @user.id
    @item = @user.item
    if @user.authenticate_only_login_key?(params)
      render json: @item.as_json(only:[:name, :value])
    else
      render :nothing => true, status: :unprocessable_entity
    end
  end

  def create
    @user = User.find_by(name: params[:name])
    @item = Item.new(name: params[:item][:name], value: params[:value],
                     user_id: @user.id)
    p "eeeeeeeeee"
    p params
    if @user.authenticate_only_login_key?(params) && @item.save
      render json: @item
    else
      render :nothing => true, status: :unprocessable_entity
    end
  end


  def update
  end

  def destroy
  end
end
