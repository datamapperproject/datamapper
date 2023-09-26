# distutils: language=c++
# cython: language_level=3

cdef extern from "HighsInfo.h" nogil:
    # From HiGHS/src/lp_data/HighsInfo.h
    cdef cppclass HighsInfo:
        # Inherited from HighsInfoStruct:
        int mip_node_count
        int simplex_iteration_count
        int ipm_iteration_count
        int crossover_iteration_count
        int primal_solution_status
        int dual_solution_status
        int basis_validity
        double objective_function_value
        double mip_dual_bound
        double mip_gap
        int num_primal_infeasibilities
        double max_primal_infeasibility
        double sum_primal_infeasibilities
        int num_dual_infeasibilities
        double max_dual_infeasibility
        double sum_dual_infeasibilities
