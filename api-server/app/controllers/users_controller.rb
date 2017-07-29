class UsersController < ApplicationController

  # /users
  def index
    @users = User.all.as_json
    render json: @users
  end

  def show
    @user = User.find_by(id: params[:id])
    render @user
  end

  #  POST /signup
  def create
    @user = User.new(name: params[:name], device_id: params[:device_id])
    @user.create_login_key
    if @user.save
      render json: @user.as_json(only:[:login_key]), status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH /signup/?device_id&login_key
  def update
    unless @user = User.find_by(device_id: params[:device_id])
      render :nothing => true, status: :unprocessable_entity
      return
    end
    if @user.authenticate?(params)
      @user.update_attribute(:name,params[:name])
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
  end
end

