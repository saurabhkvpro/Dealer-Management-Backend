import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dealer, DealerDocument } from '../schemas/dealer.schema';
import { CreateDealerDto } from '../dto/create-dealer.dto';
import { UpdateDealerDto } from '../dto/update-dealer.dto';

@Injectable()
export class DealersService {
  constructor(
    @InjectModel(Dealer.name) private dealerModel: Model<DealerDocument>,
  ) {}

  async create(createDealerDto: CreateDealerDto) {
    // Check if dealer with email already exists
    const existingDealer = await this.dealerModel.findOne({
      email: createDealerDto.email,
      isDeleted: false,
    });

    if (existingDealer) {
      throw new ConflictException('Dealer with this email already exists');
    }

    const dealer = await this.dealerModel.create(createDealerDto);

    return {
      success: true,
      data: dealer,
      message: 'Dealer created successfully',
    };
  }

  async findAll(query: any) {
    const {
      search = '',
      status = '',
      region = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const filter: any = { isDeleted: false };

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Region filter
    if (region) {
      filter.region = region;
    }

    // Pagination
    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [dealers, total] = await Promise.all([
      this.dealerModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.dealerModel.countDocuments(filter),
    ]);

    return {
      success: true,
      data: dealers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const dealer = await this.dealerModel.findOne({ _id: id, isDeleted: false });
    if (!dealer) {
      throw new NotFoundException('Dealer not found');
    }

    return {
      success: true,
      data: dealer,
    };
  }

  async update(id: string, updateDealerDto: UpdateDealerDto) {
    // Check if dealer exists
    const dealer = await this.dealerModel.findOne({ _id: id, isDeleted: false });
    if (!dealer) {
      throw new NotFoundException('Dealer not found');
    }

    // Check if email is being updated and if it's already taken
    if (updateDealerDto.email && updateDealerDto.email !== dealer.email) {
      const existingDealer = await this.dealerModel.findOne({
        email: updateDealerDto.email,
        isDeleted: false,
        _id: { $ne: id },
      });

      if (existingDealer) {
        throw new ConflictException('Dealer with this email already exists');
      }
    }

    const updatedDealer = await this.dealerModel.findByIdAndUpdate(
      id,
      updateDealerDto,
      { new: true },
    );

    return {
      success: true,
      data: updatedDealer,
      message: 'Dealer updated successfully',
    };
  }

  async remove(id: string) {
    const dealer = await this.dealerModel.findOne({ _id: id, isDeleted: false });
    if (!dealer) {
      throw new NotFoundException('Dealer not found');
    }

    // Soft delete
    await this.dealerModel.findByIdAndUpdate(id, { isDeleted: true });

    return {
      success: true,
      data: null,
      message: 'Dealer deleted successfully',
    };
  }

  async getStats() {
    const [total, active, inactive, byRegion] = await Promise.all([
      this.dealerModel.countDocuments({ isDeleted: false }),
      this.dealerModel.countDocuments({ isDeleted: false, status: 'ACTIVE' }),
      this.dealerModel.countDocuments({ isDeleted: false, status: 'INACTIVE' }),
      this.dealerModel.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$region', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return {
      success: true,
      data: {
        total,
        active,
        inactive,
        byRegion,
      },
    };
  }
}
